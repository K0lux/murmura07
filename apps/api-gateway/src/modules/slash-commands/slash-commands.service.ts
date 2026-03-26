import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CognitiveService } from '../cognitive/cognitive.service.js';
import { MessagesService } from '../messaging/messages/messages.service.js';
import { ThreadsService } from '../messaging/threads/threads.service.js';
import { AnalyseHandler } from './handlers/analyse.handler.js';
import { BrouillonHandler } from './handlers/brouillon.handler.js';
import { ReformuleHandler } from './handlers/reformule.handler.js';
import { ResumeHandler } from './handlers/resume.handler.js';
import { ToneHandler } from './handlers/tone.handler.js';
import { TraduitHandler } from './handlers/traduit.handler.js';
import { detectLanguage, normalizeCommand, normalizeSpaces } from './handlers/handler.utils.js';
import type {
  SlashCommandContextInput,
  SlashCommandExecutionContext,
  SlashCommandHandler
} from './slash-commands.types.js';

type CommandStats = {
  count: number;
  avgExecutionMs: number;
  minExecutionMs: number;
  maxExecutionMs: number;
  lastUsedAt: Date;
};

@Injectable()
export class SlashCommandsService {
  private readonly logger = new Logger(SlashCommandsService.name);
  private readonly handlers = new Map<string, SlashCommandHandler>();
  private readonly analytics = new Map<string, CommandStats>();

  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly threadsService: ThreadsService,
    private readonly messagesService: MessagesService,
    reformuleHandler: ReformuleHandler,
    analyseHandler: AnalyseHandler,
    toneHandler: ToneHandler,
    resumeHandler: ResumeHandler,
    traduitHandler: TraduitHandler,
    brouillonHandler: BrouillonHandler
  ) {
    this.registerHandlers([
      reformuleHandler,
      analyseHandler,
      toneHandler,
      resumeHandler,
      traduitHandler,
      brouillonHandler
    ]);
  }

  async execute(
    command: string,
    inputText: string,
    userId: string,
    context?: SlashCommandContextInput
  ) {
    const startedAt = Date.now();
    const normalizedCommand = normalizeCommand(command);
    const handler = this.handlers.get(normalizedCommand);
    if (!handler) {
      throw new NotFoundException(
        `Unknown slash command "${command}". Available commands: ${this.availableCommands().join(', ')}`
      );
    }

    if (!normalizeSpaces(inputText || '') && !normalizeSpaces(context?.incomingMessage || '')) {
      throw new BadRequestException('inputText cannot be empty');
    }

    const executionContext = await this.buildExecutionContext(
      userId,
      normalizedCommand,
      inputText,
      context
    );

    const handled = await handler.execute(executionContext);
    const executionTimeMs = Date.now() - startedAt;
    this.recordAnalytics(normalizedCommand, executionTimeMs);

    this.logger.log(
      `Slash command executed userId=${userId} command=${normalizedCommand} capability=${handled.capabilityUsed} executionMs=${executionTimeMs}`
    );

    return {
      result: handled.result,
      capabilityUsed: handled.capabilityUsed,
      executionTimeMs
    };
  }

  async getSuggestions(threadId: string | undefined, userId: string) {
    if (!threadId) {
      return {
        threadId: null,
        suggestions: ['/reformule', '/analyse', '/tone'],
        contextSignals: {
          reason: 'thread_missing'
        }
      };
    }

    let interlocuteurId: string | undefined;
    let latestMessage = '';
    let tensionScore = 0.5;
    let ambiguityScore = 0.5;

    try {
      const thread = await this.threadsService.getThread(threadId, userId);
      interlocuteurId = thread.interlocuteurId;

      const messages = await this.messagesService.listMessages(userId, threadId, 20);
      const latest = messages.at(-1);
      latestMessage = normalizeSpaces(latest?.content ?? '');

      if (latestMessage) {
        const analysis = await this.cognitiveService.analyze(`slash_suggest_${Date.now()}`, {
          userId,
          canal: 'api',
          interlocuteurId: interlocuteurId ?? 'unknown',
          content: latestMessage,
          metadata: {
            timestamp: new Date(),
            threadId,
            urgencyFlag: false,
            attachments: []
          }
        });
        tensionScore = analysis.analysis.tensionScore;
        ambiguityScore = analysis.analysis.ambiguityScore;
      }
    } catch (error) {
      this.logger.warn(
        `Suggestions fallback for thread=${threadId}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    const messageLength = latestMessage.length;
    const language = detectLanguage(latestMessage);
    const scores: Array<{ command: string; score: number; reason: string }> = [
      {
        command: '/reformule',
        score: (messageLength >= 140 ? 2 : 0) + (ambiguityScore >= 0.45 ? 2 : 0),
        reason: 'clarify_and_improve'
      },
      {
        command: '/analyse',
        score: (tensionScore >= 0.55 ? 3 : 1) + (ambiguityScore >= 0.5 ? 1 : 0),
        reason: 'understand_intention_and_tension'
      },
      {
        command: '/tone',
        score: (tensionScore >= 0.6 ? 3 : 1) + (interlocuteurId ? 1 : 0),
        reason: 'adapt_message_tone'
      },
      {
        command: '/resume',
        score: messageLength >= 220 ? 3 : messageLength >= 120 ? 2 : 0,
        reason: 'extract_key_points'
      },
      {
        command: '/traduit',
        score: language === 'unknown' ? 1 : 2,
        reason: 'language_adaptation'
      },
      {
        command: '/brouillon',
        score: tensionScore >= 0.55 || messageLength < 40 ? 2 : 1,
        reason: 'generate_ready_to_send_reply'
      }
    ];

    const suggestions = scores.sort((a, b) => b.score - a.score).slice(0, 3);
    return {
      threadId,
      suggestions: suggestions.map((item) => item.command),
      contextSignals: {
        messageLength,
        tensionScore: Number(tensionScore.toFixed(2)),
        ambiguityScore: Number(ambiguityScore.toFixed(2)),
        language,
        ranked: suggestions
      }
    };
  }

  private registerHandlers(handlers: SlashCommandHandler[]) {
    for (const handler of handlers) {
      this.handlers.set(normalizeCommand(handler.command), handler);
      for (const alias of handler.aliases ?? []) {
        this.handlers.set(normalizeCommand(alias), handler);
      }
    }
  }

  private async buildExecutionContext(
    userId: string,
    command: string,
    inputText: string,
    context?: SlashCommandContextInput
  ): Promise<SlashCommandExecutionContext> {
    const built: SlashCommandExecutionContext = {
      userId,
      command,
      inputText: normalizeSpaces(inputText),
      incomingMessage: context?.incomingMessage ? normalizeSpaces(context.incomingMessage) : undefined,
      threadId: context?.threadId,
      tone: context?.tone,
      targetLanguage: context?.targetLanguage
    };

    if (context?.threadId) {
      try {
        const thread = await this.threadsService.getThread(context.threadId, userId);
        built.interlocuteurId = thread.interlocuteurId;
      } catch (error) {
        this.logger.warn(
          `Unable to enrich slash context with thread data: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return built;
  }

  private recordAnalytics(command: string, executionTimeMs: number) {
    const current = this.analytics.get(command);
    if (!current) {
      this.analytics.set(command, {
        count: 1,
        avgExecutionMs: executionTimeMs,
        minExecutionMs: executionTimeMs,
        maxExecutionMs: executionTimeMs,
        lastUsedAt: new Date()
      });
      return;
    }

    const count = current.count + 1;
    const avgExecutionMs = (current.avgExecutionMs * current.count + executionTimeMs) / count;
    this.analytics.set(command, {
      count,
      avgExecutionMs,
      minExecutionMs: Math.min(current.minExecutionMs, executionTimeMs),
      maxExecutionMs: Math.max(current.maxExecutionMs, executionTimeMs),
      lastUsedAt: new Date()
    });
  }

  private availableCommands() {
    return ['/reformule', '/analyse', '/tone', '/resume', '/traduit', '/brouillon'];
  }
}


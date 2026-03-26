import { Injectable, Logger } from '@nestjs/common';
import { CognitiveService } from '../../cognitive/cognitive.service.js';
import { OpenClawService } from '../../openclaw/openclaw.service.js';
import type {
  SlashCommandExecutionContext,
  SlashCommandHandler,
  SlashCommandResult
} from '../slash-commands.types.js';
import { loadSoulProfile, normalizeSpaces, pickResponseText } from './handler.utils.js';

@Injectable()
export class ReformuleHandler implements SlashCommandHandler {
  readonly command = 'reformule';
  readonly aliases = ['rewrite'];
  private readonly logger = new Logger(ReformuleHandler.name);

  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly openClawService: OpenClawService
  ) {}

  async execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult> {
    const sourceText = normalizeSpaces(context.incomingMessage ?? context.inputText);
    const identity = await this.cognitiveService.getIdentity(context.userId);
    const relationship = context.interlocuteurId
      ? await this.cognitiveService.getRelationshipDetail(context.userId, context.interlocuteurId)
      : null;
    const analysis = await this.cognitiveService.analyze(`slash_reformule_${Date.now()}`, {
      userId: context.userId,
      canal: 'api',
      interlocuteurId: context.interlocuteurId ?? context.threadId ?? 'unknown',
      content: sourceText,
      metadata: {
        timestamp: new Date(),
        threadId: context.threadId,
        urgencyFlag: false,
        attachments: []
      }
    });
    const soulProfile = await loadSoulProfile(this.cognitiveService, context.userId);

    try {
      const response = await this.openClawService.executeAction(
        'rewrite_message',
        {
          originalText: sourceText,
          mode: 'faithful_intent',
          expectedOutputs: ['main', 'alternative'],
          identity: identity.communicationStyle,
          relationshipType: relationship?.relationshipType ?? 'unknown',
          tensionScore: analysis.analysis.tensionScore,
          soulProfile
        },
        {
          userId: context.userId,
          context: {
            threadId: context.threadId ?? null
          }
        }
      );

      const llmText = pickResponseText(response);
      if (llmText) {
        return {
          result: llmText,
          capabilityUsed: 'rewrite_message'
        };
      }
    } catch (error) {
      this.logger.warn(
        `OpenClaw rewrite fallback triggered: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    const mainVersion = this.buildMainFallback(sourceText);
    const conciseVersion = this.buildAlternativeFallback(sourceText);
    return {
      result: `Version principale:\n${mainVersion}\n\nAlternative concise:\n${conciseVersion}`,
      capabilityUsed: 'rewrite_fallback'
    };
  }

  private buildMainFallback(text: string) {
    const sentence = normalizeSpaces(text);
    if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
      return `${sentence}.`;
    }
    return sentence;
  }

  private buildAlternativeFallback(text: string) {
    const normalized = normalizeSpaces(text);
    const parts = normalized.split(/[.!?]/).map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) {
      return normalized;
    }
    const first = parts[0] ?? normalized;
    return first.length > 150 ? `${first.slice(0, 147).trim()}...` : first;
  }
}


import { Injectable, Logger } from '@nestjs/common';
import { CognitiveService } from '../../cognitive/cognitive.service.js';
import { OpenClawService } from '../../openclaw/openclaw.service.js';
import type {
  SlashCommandExecutionContext,
  SlashCommandHandler,
  SlashCommandResult
} from '../slash-commands.types.js';
import {
  loadSoulProfile,
  normalizeSpaces,
  pickResponseText,
  toSupportedTone,
  type SupportedTone
} from './handler.utils.js';

@Injectable()
export class ToneHandler implements SlashCommandHandler {
  readonly command = 'tone';
  readonly aliases = ['ton'];
  private readonly logger = new Logger(ToneHandler.name);

  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly openClawService: OpenClawService
  ) {}

  async execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult> {
    const parsed = this.parseToneInput(context.inputText, context.tone);
    const sourceText = normalizeSpaces(parsed.text);
    const targetTone = parsed.tone;
    const identity = await this.cognitiveService.getIdentity(context.userId);
    const soulProfile = await loadSoulProfile(this.cognitiveService, context.userId);

    try {
      const response = await this.openClawService.executeAction(
        'adjust_tone',
        {
          originalText: sourceText,
          targetTone,
          preserveFacts: true,
          communicationStyle: identity.communicationStyle,
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
          capabilityUsed: 'tone_adjustment'
        };
      }
    } catch (error) {
      this.logger.warn(
        `OpenClaw tone fallback triggered: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return {
      result: this.localToneFallback(sourceText, targetTone),
      capabilityUsed: 'tone_fallback'
    };
  }

  private parseToneInput(inputText: string, explicitTone?: string) {
    const normalized = normalizeSpaces(inputText);
    if (explicitTone) {
      return {
        tone: toSupportedTone(explicitTone),
        text: normalized
      };
    }

    const tokenized = normalized.match(/^(tone|ton)\s*[:=]\s*([a-zA-Z-]+)\s*[|:]\s*(.+)$/);
    if (tokenized?.[2] && tokenized[3]) {
      return {
        tone: toSupportedTone(tokenized[2]),
        text: tokenized[3]
      };
    }

    const bracketed = normalized.match(/^\[([a-zA-Z-]+)\]\s*(.+)$/);
    if (bracketed?.[1] && bracketed[2]) {
      return {
        tone: toSupportedTone(bracketed[1]),
        text: bracketed[2]
      };
    }

    return {
      tone: 'professionnel' as SupportedTone,
      text: normalized
    };
  }

  private localToneFallback(text: string, tone: SupportedTone) {
    const prefixes: Record<SupportedTone, string> = {
      formel: 'Bonjour,',
      empathique: 'Je comprends ton point de vue.',
      direct: 'Pour etre clair:',
      diplomatique: 'Merci pour ce retour,',
      professionnel: 'Bonjour,',
      chaleureux: 'Salut,'
    };

    const suffixes: Record<SupportedTone, string> = {
      formel: 'Cordialement.',
      empathique: "Je reste disponible pour en parler sereinement.",
      direct: 'Dis-moi si tu veux que je precise un point.',
      diplomatique: 'Je propose que nous avancions sur cette base.',
      professionnel: 'Merci de ton attention.',
      chaleureux: 'Merci beaucoup.'
    };

    return `${prefixes[tone]} ${text} ${suffixes[tone]}`.trim();
  }
}


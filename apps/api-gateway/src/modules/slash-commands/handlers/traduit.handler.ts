import { Injectable, Logger } from '@nestjs/common';
import { CognitiveService } from '../../cognitive/cognitive.service.js';
import { OpenClawService } from '../../openclaw/openclaw.service.js';
import type {
  SlashCommandExecutionContext,
  SlashCommandHandler,
  SlashCommandResult
} from '../slash-commands.types.js';
import {
  detectLanguage,
  loadSoulProfile,
  normalizeCommand,
  normalizeSpaces,
  pickResponseText
} from './handler.utils.js';

@Injectable()
export class TraduitHandler implements SlashCommandHandler {
  readonly command = 'traduit';
  readonly aliases = ['translate'];
  private readonly logger = new Logger(TraduitHandler.name);

  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly openClawService: OpenClawService
  ) {}

  async execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult> {
    const sourceText = normalizeSpaces(context.incomingMessage ?? context.inputText);
    const identity = await this.cognitiveService.getIdentity(context.userId);
    const soulProfile = await loadSoulProfile(this.cognitiveService, context.userId);
    const sourceLanguage = detectLanguage(sourceText);
    const targetLanguage = this.resolveTargetLanguage(
      context.targetLanguage,
      soulProfile,
      sourceLanguage
    );
    const relationship = context.interlocuteurId
      ? await this.cognitiveService.getRelationshipDetail(context.userId, context.interlocuteurId)
      : null;

    try {
      const response = await this.openClawService.executeAction(
        'translate_text',
        {
          text: sourceText,
          sourceLanguage,
          targetLanguage,
          politenessMode: this.resolvePolitenessMode(relationship?.relationshipType),
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
          capabilityUsed: 'translation'
        };
      }
    } catch (error) {
      this.logger.warn(
        `OpenClaw translation fallback triggered: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return {
      result: `[fallback:${sourceLanguage}->${targetLanguage}] ${sourceText}`,
      capabilityUsed: 'translation_fallback'
    };
  }

  private resolveTargetLanguage(
    explicitTarget: string | undefined,
    soulProfile: string | null,
    sourceLanguage: 'fr' | 'en' | 'unknown'
  ) {
    if (explicitTarget) {
      return normalizeCommand(explicitTarget);
    }

    if (soulProfile) {
      const languageMatch = soulProfile.match(
        /(langue\s*cible|target\s*language|preferred\s*language)\s*[:=]\s*([a-zA-Z-]+)/i
      );
      if (languageMatch?.[2]) {
        return normalizeCommand(languageMatch[2]);
      }
    }

    if (sourceLanguage === 'fr') {
      return 'en';
    }
    return 'fr';
  }

  private resolvePolitenessMode(relationshipType?: string) {
    if (!relationshipType) {
      return 'neutral';
    }

    if (
      relationshipType === 'professional_superior' ||
      relationshipType === 'professional_peer' ||
      relationshipType === 'professional_subordinate'
    ) {
      return 'formal';
    }

    return relationshipType === 'personal_close' ? 'friendly' : 'neutral';
  }
}


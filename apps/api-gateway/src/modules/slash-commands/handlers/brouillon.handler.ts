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
export class BrouillonHandler implements SlashCommandHandler {
  readonly command = 'brouillon';
  readonly aliases = ['draft'];
  private readonly logger = new Logger(BrouillonHandler.name);

  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly openClawService: OpenClawService
  ) {}

  async execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult> {
    const prompt = normalizeSpaces(context.inputText);
    const identity = await this.cognitiveService.getIdentity(context.userId);
    const relationship = context.interlocuteurId
      ? await this.cognitiveService.getRelationshipDetail(context.userId, context.interlocuteurId)
      : null;
    const soulProfile = await loadSoulProfile(this.cognitiveService, context.userId);

    try {
      const response = await this.openClawService.executeAction(
        'draft_ai_agent',
        {
          prompt,
          variants: 2,
          style: identity.communicationStyle,
          relationshipType: relationship?.relationshipType ?? 'unknown',
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
          capabilityUsed: 'draft_generation'
        };
      }
    } catch (error) {
      this.logger.warn(
        `OpenClaw draft fallback triggered: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    const firstSentence =
      prompt.split(/[.!?]/).map((part) => part.trim()).find(Boolean) ?? 'Bonjour,';
    const shortDraft = `Version courte:\nBonjour,\n\n${firstSentence}.\n\nMerci.`;
    const longDraft = [
      'Version detaillee:',
      'Bonjour,',
      '',
      `${prompt}.`,
      '',
      "Je reste disponible pour ajuster ce plan selon tes priorites.",
      '',
      'Cordialement,'
    ].join('\n');

    return {
      result: `${shortDraft}\n\n${longDraft}`,
      capabilityUsed: 'draft_fallback'
    };
  }
}


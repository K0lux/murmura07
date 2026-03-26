import { Injectable } from '@nestjs/common';
import { CognitiveService } from '../../cognitive/cognitive.service.js';
import type {
  SlashCommandExecutionContext,
  SlashCommandHandler,
  SlashCommandResult
} from '../slash-commands.types.js';
import { normalizeSpaces } from './handler.utils.js';

@Injectable()
export class AnalyseHandler implements SlashCommandHandler {
  readonly command = 'analyse';
  readonly aliases = ['analyze', 'analysis'];

  constructor(private readonly cognitiveService: CognitiveService) {}

  async execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult> {
    const sourceText = normalizeSpaces(context.incomingMessage ?? context.inputText);
    const analysisResponse = await this.cognitiveService.analyze(`slash_analyse_${Date.now()}`, {
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

    const analysis = analysisResponse.analysis;
    const paragraph = [
      `Ce message exprime surtout "${analysis.emotion.dominant}" avec une intensite de ${analysis.emotion.intensity.toFixed(2)}.`,
      `Le niveau de tension est ${analysis.tensionScore.toFixed(2)} et l'intention dominante est "${analysis.intention}".`,
      `La demande explicite identifiee est "${analysis.explicitDemand}", avec une urgence "${analysis.urgencyLevel}".`,
      analysis.implicitDemand ? `La demande implicite probable est "${analysis.implicitDemand}".` : null
    ]
      .filter(Boolean)
      .join(' ');

    const signals = [
      `Emotion dominante: ${analysis.emotion.dominant}`,
      `Intensite emotionnelle: ${analysis.emotion.intensity.toFixed(2)}`,
      `Tension: ${analysis.tensionScore.toFixed(2)}`,
      `Intention: ${analysis.intention}`,
      `Ambiguite: ${analysis.ambiguityScore.toFixed(2)}`,
      `Urgence: ${analysis.urgencyLevel}`,
      `Asymetrie de pouvoir: ${analysis.powerAsymmetry.direction} (${analysis.powerAsymmetry.intensity.toFixed(2)})`
    ];

    return {
      result: `${paragraph}\n\nSignaux detectes:\n- ${signals.join('\n- ')}`,
      capabilityUsed: 'cognitive_analysis'
    };
  }
}


import {
  MessageAnalysis,
  MessageAnalysisSchema,
  RawMessage,
  Intention,
  UrgencyLevel
} from '@murmura/cognitive-core-shared';
import { IntentionAnalyzer } from './analyzers/intention.analyzer.js';
import { EmotionAnalyzer } from './analyzers/emotion.analyzer.js';
import { DemandsExtractor } from './pipeline/demands.extractor.js';

export class IngestionPipeline {
  constructor(
    private readonly intentionAnalyzer = new IntentionAnalyzer(),
    private readonly emotionAnalyzer = new EmotionAnalyzer(),
    private readonly demandsExtractor = new DemandsExtractor()
  ) {}

  async process(message: RawMessage): Promise<MessageAnalysis> {
    const [intentionResult, emotionResult, demandResult] = await Promise.all([
      this.safeIntention(message.content),
      this.safeEmotion(message.content),
      this.safeDemands(message.content)
    ]);

    const analysis: MessageAnalysis = {
      intention: intentionResult.intention,
      emotion: emotionResult.emotion,
      tensionScore: emotionResult.tensionScore,
      explicitDemand: demandResult.explicitDemand,
      implicitDemand: demandResult.implicitDemand,
      urgencyLevel: intentionResult.urgencyLevel,
      powerAsymmetry: emotionResult.powerAsymmetry,
      ambiguityScore: Math.max(intentionResult.ambiguityScore, emotionResult.ambiguityScore)
    };

    return MessageAnalysisSchema.parse(analysis);
  }

  private async safeIntention(content: string): Promise<{ intention: Intention; urgencyLevel: UrgencyLevel; ambiguityScore: number }> {
    try {
      const result = await this.intentionAnalyzer.analyze(content);
      return {
        intention: result.intention,
        urgencyLevel: result.urgencyLevel,
        ambiguityScore: result.ambiguityScore
      };
    } catch {
      return { intention: 'unknown', urgencyLevel: 'low', ambiguityScore: 0.8 };
    }
  }

  private async safeEmotion(content: string) {
    try {
      return await this.emotionAnalyzer.analyze(content);
    } catch {
      return {
        emotion: { dominant: 'neutral', intensity: 0.2 },
        tensionScore: 0.2,
        ambiguityScore: 0.4,
        powerAsymmetry: { direction: 'balanced', intensity: 0.2 }
      };
    }
  }

  private async safeDemands(content: string) {
    try {
      return await this.demandsExtractor.extract(content);
    } catch {
      return { explicitDemand: 'Demande implicite à clarifier' };
    }
  }
}


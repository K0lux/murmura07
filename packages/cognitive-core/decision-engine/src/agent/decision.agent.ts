import {
  AutonomyConfig,
  Decision,
  MessageAnalysis,
  Recommendation,
  SimulationResult,
  Alert
} from '@murmura/cognitive-core-shared';
import { GovernanceAgent } from '@murmura/cognitive-core-governance';
import { AutonomyEvaluator } from './autonomy.evaluator.js';
import { DecisionAssembler } from './decision.assembler.js';
import { DecisionPersister } from './decision.persister.js';

export class DecisionOrchestrationAgent {
  constructor(
    private readonly assembler = new DecisionAssembler(),
    private readonly autonomy = new AutonomyEvaluator(),
    private readonly governance = new GovernanceAgent(),
    private readonly persister = new DecisionPersister()
  ) {}

  async decide(input: {
    userId: string;
    requestId: string;
    analysis: MessageAnalysis;
    recommendation: Recommendation;
    simulations: SimulationResult[];
    alerts: Alert[];
    autonomyConfig: AutonomyConfig;
  }): Promise<Decision> {
    const baseDecision = this.assembler.assemble({
      requestId: input.requestId,
      analysis: input.analysis,
      recommendation: input.recommendation,
      simulations: input.simulations,
      alerts: input.alerts
    });

    const level = this.autonomy.evaluate(input.autonomyConfig, input.analysis);
    const decision = this.autonomy.apply(baseDecision, level);

    const governance = await this.governance.check(decision, input.userId);
    if (!governance.allowed) {
      return {
        ...decision,
        suggestedReply: undefined,
        explanation: governance.blockedReason ?? 'blocked'
      };
    }

    await this.persister.persist(input.userId, decision);
    return decision;
  }
}


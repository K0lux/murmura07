import type {
  Alert,
  AutonomyConfig,
  Decision,
  MessageAnalysis,
  Recommendation,
  SimulationResult
} from '@murmura/cognitive-core-shared';
import { TIMEOUTS_MS } from '@murmura/cognitive-core-shared';
import { CircuitBreaker } from './circuit.breaker.js';
import { degradeResponse } from './degradation.manager.js';
import { withRetry } from './retry.policy.js';

type StepName = 'recommendation' | 'simulations' | 'alerts' | 'decision';

type PipelineInput = {
  userId: string;
  requestId: string;
  analysis: MessageAnalysis;
  recommendation: Recommendation;
  simulations: SimulationResult[];
  alerts: Alert[];
  autonomyConfig: AutonomyConfig;
};

type DecisionAgent = {
  decide(input: PipelineInput): Promise<Decision>;
};

type StepResult<T> = {
  value: T;
  degradedReason?: string;
};

type StepConfig = {
  retries: number;
  baseDelayMs: number;
  timeoutMs: number;
  breakerThreshold: number;
  breakerWindowMs: number;
  breakerRecoveryMs: number;
};

type PipelineOrchestratorOptions = {
  recommendationResolver?: (input: PipelineInput) => Promise<Recommendation> | Recommendation;
  simulationsResolver?: (input: PipelineInput) => Promise<SimulationResult[]> | SimulationResult[];
  alertsResolver?: (input: PipelineInput) => Promise<Alert[]> | Alert[];
  stepConfig?: Partial<Record<StepName, Partial<StepConfig>>>;
};

const DEFAULT_STEP_CONFIG: Record<StepName, StepConfig> = {
  recommendation: {
    retries: 1,
    baseDelayMs: 100,
    timeoutMs: TIMEOUTS_MS.reasoning,
    breakerThreshold: 3,
    breakerWindowMs: 10_000,
    breakerRecoveryMs: 5_000
  },
  simulations: {
    retries: 1,
    baseDelayMs: 100,
    timeoutMs: TIMEOUTS_MS.simulation,
    breakerThreshold: 3,
    breakerWindowMs: 10_000,
    breakerRecoveryMs: 5_000
  },
  alerts: {
    retries: 1,
    baseDelayMs: 100,
    timeoutMs: TIMEOUTS_MS.reasoning,
    breakerThreshold: 3,
    breakerWindowMs: 10_000,
    breakerRecoveryMs: 5_000
  },
  decision: {
    retries: 2,
    baseDelayMs: 200,
    timeoutMs: TIMEOUTS_MS.pipeline,
    breakerThreshold: 5,
    breakerWindowMs: 10_000,
    breakerRecoveryMs: 5_000
  }
};

export class PipelineOrchestrator {
  private readonly stepConfig: Record<StepName, StepConfig>;
  private readonly breakers: Record<StepName, CircuitBreaker>;

  constructor(
    private readonly decisionAgent: DecisionAgent,
    private readonly options: PipelineOrchestratorOptions = {}
  ) {
    this.stepConfig = this.buildStepConfig(options.stepConfig);
    this.breakers = {
      recommendation: this.createBreaker('recommendation'),
      simulations: this.createBreaker('simulations'),
      alerts: this.createBreaker('alerts'),
      decision: this.createBreaker('decision')
    };
  }

  async run(input: PipelineInput): Promise<Decision> {
    const [recommendationStep, simulationsStep, alertsStep] = await Promise.all([
      this.executeStep('recommendation', async () => await this.resolveRecommendation(input), () => ({
        value: this.fallbackRecommendation(input),
        degradedReason: 'recommendation_unavailable'
      })),
      this.executeStep('simulations', async () => await this.resolveSimulations(input), () => ({
        value: input.simulations,
        degradedReason: 'simulations_unavailable'
      })),
      this.executeStep('alerts', async () => await this.resolveAlerts(input), () => ({
        value: input.alerts,
        degradedReason: 'alerts_unavailable'
      }))
    ]);

    const degradedReasons = [
      recommendationStep.degradedReason,
      simulationsStep.degradedReason,
      alertsStep.degradedReason
    ].filter((reason): reason is string => Boolean(reason));

    const decisionInput: PipelineInput = {
      ...input,
      recommendation: recommendationStep.value,
      simulations: simulationsStep.value,
      alerts: alertsStep.value
    };

    const decisionStep = await this.executeStep(
      'decision',
      () => this.decisionAgent.decide(decisionInput),
      () => ({
        value: this.buildFallbackDecision(decisionInput, degradedReasons),
        degradedReason: 'decision_unavailable'
      })
    );

    if (decisionStep.degradedReason) {
      degradedReasons.push(decisionStep.degradedReason);
    }

    if (degradedReasons.length === 0) {
      return decisionStep.value;
    }

    return degradeResponse(decisionStep.value, degradedReasons.join(', '));
  }

  private buildStepConfig(
    overrides: PipelineOrchestratorOptions['stepConfig']
  ): Record<StepName, StepConfig> {
    return {
      recommendation: { ...DEFAULT_STEP_CONFIG.recommendation, ...overrides?.recommendation },
      simulations: { ...DEFAULT_STEP_CONFIG.simulations, ...overrides?.simulations },
      alerts: { ...DEFAULT_STEP_CONFIG.alerts, ...overrides?.alerts },
      decision: { ...DEFAULT_STEP_CONFIG.decision, ...overrides?.decision }
    };
  }

  private createBreaker(step: StepName) {
    const config = this.stepConfig[step];
    return new CircuitBreaker(
      config.breakerThreshold,
      config.breakerWindowMs,
      config.breakerRecoveryMs
    );
  }

  private async executeStep<T>(
    step: StepName,
    operation: () => Promise<T>,
    fallback: (error: unknown) => StepResult<T>
  ): Promise<StepResult<T>> {
    const breaker = this.breakers[step];
    const config = this.stepConfig[step];

    if (!breaker.canExecute()) {
      return fallback(new Error(`Circuit breaker open for ${step}`));
    }

    try {
      const value = await withRetry(
        () => this.withTimeout(step, operation, config.timeoutMs),
        config.retries,
        config.baseDelayMs
      );
      breaker.onSuccess();
      return { value };
    } catch (error) {
      breaker.onFailure();
      return fallback(error);
    }
  }

  private async withTimeout<T>(
    step: StepName,
    operation: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return await Promise.race([
      operation(),
      new Promise<T>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`${step} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        timer.unref?.();
      })
    ]);
  }

  private resolveRecommendation(input: PipelineInput) {
    return Promise.resolve(this.options.recommendationResolver?.(input) ?? input.recommendation);
  }

  private resolveSimulations(input: PipelineInput) {
    return Promise.resolve(this.options.simulationsResolver?.(input) ?? input.simulations);
  }

  private resolveAlerts(input: PipelineInput) {
    return Promise.resolve(this.options.alertsResolver?.(input) ?? input.alerts);
  }

  private fallbackRecommendation(input: PipelineInput): Recommendation {
    return {
      strategy: input.analysis.tensionScore > 0.6 ? 'defer' : input.recommendation.strategy,
      rationale: 'fallback_recommendation',
      confidence: Math.min(input.recommendation.confidence, 0.35)
    };
  }

  private buildFallbackDecision(input: PipelineInput, existingReasons: string[]): Decision {
    const safeStrategy = input.analysis.tensionScore > 0.6 ? 'defer' : input.recommendation.strategy;
    const allReasons = [...existingReasons, 'decision_unavailable'];

    return {
      id: `decision_${Date.now()}`,
      requestId: input.requestId,
      timestamp: new Date(),
      selectedStrategy: safeStrategy,
      suggestedReply: undefined,
      alternativeReplies: [],
      alerts: input.alerts,
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: `fallback:${allReasons.join(',')}`,
      confidence: Math.min(input.recommendation.confidence, 0.25),
      simulations: input.simulations
    };
  }
}

export type { PipelineInput, PipelineOrchestratorOptions, DecisionAgent };

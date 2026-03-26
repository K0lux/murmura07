import fs from 'node:fs/promises';
import path from 'node:path';
import { DecisionOrchestrationAgent } from '@murmura/cognitive-core-decision-engine';
import { IngestionPipeline } from '@murmura/cognitive-core-ingestion';
import { messagesFixture } from '../packages/cognitive-core/shared/fixtures/messages.fixture.js';
import { scenariosFixture } from '../packages/cognitive-core/shared/fixtures/scenarios.fixture.js';
import { PipelineOrchestrator } from '../packages/cognitive-core/api/src/orchestrator/pipeline.orchestrator.js';

interface EvalThresholds {
  intentionAccuracy: number;
  averageScoreError: number;
  styleRespectRate: number;
}

function readThresholds(): EvalThresholds {
  return {
    intentionAccuracy: Number(process.env['LLM_EVAL_MIN_INTENTION_ACCURACY'] ?? 0.8),
    averageScoreError: Number(process.env['LLM_EVAL_MAX_SCORE_ERROR'] ?? 0.2),
    styleRespectRate: Number(process.env['LLM_EVAL_MIN_STYLE_RATE'] ?? 0.85)
  };
}

async function main() {
  const thresholds = readThresholds();
  const startedAt = new Date().toISOString();
  process.env['MURMURA_WORKSPACE_DIR'] ??= path.resolve('.murmura', 'eval-workspaces');

  const ingestion = new IngestionPipeline();
  const orchestrator = new PipelineOrchestrator(new DecisionOrchestrationAgent());

  const messageCases = await Promise.all(
    messagesFixture.map(async (fixture, index) => {
      const analysis = await ingestion.process({
        userId: fixture.userId,
        canal: fixture.canal,
        interlocuteurId: fixture.interlocuteurId,
        content: fixture.content,
        metadata: { timestamp: new Date(), urgencyFlag: false, attachments: [] }
      });

      return {
        input: fixture.content,
        expectedIntention: fixture.expected.intention,
        predictedIntention: analysis.intention,
        expectedTensionScore: fixture.expected.tensionScore,
        predictedTensionScore: analysis.tensionScore,
        rawAnalysis: analysis,
        caseId: `message_${index + 1}`
      };
    })
  );

  const scenarioCases = await Promise.all(
    scenariosFixture.map(async (scenario, index) => {
      const analysis = await ingestion.process({
        userId: `eval_user_${index + 1}`,
        canal: 'email',
        interlocuteurId: `eval_contact_${index + 1}`,
        content: scenario.message,
        metadata: { timestamp: new Date(), urgencyFlag: false, attachments: [] }
      });

      const recommendation = {
        strategy: analysis.tensionScore > 0.6 ? 'respond_diplomatic' : 'respond_direct',
        rationale: 'llm_eval',
        confidence: 0.5
      } as const;

      const decision = await orchestrator.run({
        userId: `eval_user_${index + 1}`,
        requestId: `eval_request_${index + 1}`,
        analysis,
        recommendation,
        simulations: [],
        alerts: [],
        autonomyConfig: { userId: `eval_user_${index + 1}`, defaultLevel: 'suggestion_only', rules: [] }
      });

      return {
        input: scenario.message,
        expectedStyleCompliant: true,
        predictedStyleCompliant: ['respond_direct', 'respond_diplomatic', 'defer'].includes(
          decision.selectedStrategy
        ),
        expectedDecision: scenario.decision,
        predictedDecision: decision.selectedStrategy,
        rawDecision: decision,
        caseId: `scenario_${index + 1}`
      };
    })
  );

  const totalMessages = messageCases.length;
  const totalScenarios = scenarioCases.length;
  const correctIntentions = messageCases.filter(
    (messageCase) => messageCase.predictedIntention === messageCase.expectedIntention
  ).length;
  const scoreErrors = messageCases.map((messageCase) =>
    Math.abs(messageCase.predictedTensionScore - messageCase.expectedTensionScore)
  );
  const styleMatches = scenarioCases.filter((scenario) => scenario.predictedStyleCompliant).length;

  const metrics = {
    intentionAccuracy: totalMessages === 0 ? 0 : correctIntentions / totalMessages,
    averageScoreError:
      scoreErrors.length === 0
        ? 0
        : scoreErrors.reduce((sum, scoreError) => sum + scoreError, 0) / scoreErrors.length,
    styleRespectRate: totalScenarios === 0 ? 0 : styleMatches / totalScenarios
  };

  const checks = {
    intentionAccuracy: metrics.intentionAccuracy >= thresholds.intentionAccuracy,
    averageScoreError: metrics.averageScoreError <= thresholds.averageScoreError,
    styleRespectRate: metrics.styleRespectRate >= thresholds.styleRespectRate
  };

  const report = {
    startedAt,
    totals: {
      messages: totalMessages,
      scenarios: totalScenarios
    },
    thresholds,
    metrics,
    checks,
    status: Object.values(checks).every(Boolean) ? 'passed' : 'failed',
    samples: {
      messages: messageCases,
      scenarios: scenarioCases
    }
  };

  const outDir = path.resolve('reports');
  await fs.mkdir(outDir, { recursive: true });

  const outFile = path.join(outDir, 'llm-eval.json');
  const summaryFile = path.join(outDir, 'llm-eval-summary.md');

  await fs.writeFile(outFile, JSON.stringify(report, null, 2));
  await fs.writeFile(
    summaryFile,
    [
      '# LLM Evaluation',
      '',
      `- Status: ${report.status}`,
      `- Intention accuracy: ${metrics.intentionAccuracy.toFixed(2)} (threshold ${thresholds.intentionAccuracy.toFixed(2)})`,
      `- Average score error: ${metrics.averageScoreError.toFixed(2)} (threshold ${thresholds.averageScoreError.toFixed(2)})`,
      `- Style respect rate: ${metrics.styleRespectRate.toFixed(2)} (threshold ${thresholds.styleRespectRate.toFixed(2)})`
    ].join('\n')
  );

  console.log(`LLM eval report written to ${outFile}`);

  if (report.status !== 'passed') {
    throw new Error('LLM evaluation thresholds not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { IngestionPipeline } from '@murmura/cognitive-core-ingestion';
import { DecisionOrchestrationAgent } from '@murmura/cognitive-core-decision-engine';
import { MurmuraResponseSchema } from '@murmura/cognitive-core-shared';
import { PipelineOrchestrator } from '../orchestrator/pipeline.orchestrator.js';

const AnalyzeSchema = z.object({
  content: z.string().min(1),
  canal: z.string().min(1),
  interlocuteurId: z.string().min(1)
});

export async function analyzeRoute(app: FastifyInstance) {
  const ingestion = new IngestionPipeline();
  const orchestrator = new PipelineOrchestrator(new DecisionOrchestrationAgent());

  app.post('/', async (request) => {
    const body = (app as any).validateBody(AnalyzeSchema, request.body);
    const userId = request.user?.userId ?? 'anonymous';
    const requestId = request.headers['x-request-id'] ?? `req_${Date.now()}`;

    const analysis = await ingestion.process({
      userId,
      canal: body.canal,
      interlocuteurId: body.interlocuteurId,
      content: body.content,
      metadata: { timestamp: new Date(), urgencyFlag: false, attachments: [] }
    });

    const decision = await orchestrator.run({
      userId,
      requestId: String(requestId),
      analysis,
      recommendation: {
        strategy: analysis.tensionScore > 0.6 ? 'respond_diplomatic' : 'respond_direct',
        rationale: 'auto',
        confidence: 0.5
      },
      simulations: [],
      alerts: [],
      autonomyConfig: { userId, defaultLevel: 'suggestion_only', rules: [] }
    });

    const response = {
      requestId: String(requestId),
      analysis,
      recommendation: {
        strategy: decision.selectedStrategy,
        rationale: decision.explanation,
        confidence: decision.confidence,
        suggestedReply: decision.suggestedReply
      },
      simulations: [],
      alerts: [],
      autonomyAllowed: decision.autonomyAllowed
    };

    return MurmuraResponseSchema.parse(response);
  });
}


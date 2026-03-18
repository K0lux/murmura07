import { describe, expect, it } from 'vitest';
import { IngestionPipeline } from '../ingestion.pipeline.js';

const pipeline = new IngestionPipeline();

describe('IngestionPipeline', () => {
  it('classifies question as information', async () => {
    const result = await pipeline.process({
      userId: 'u1',
      canal: 'email',
      interlocuteurId: 'i1',
      content: 'Peux-tu me dire si le fichier est prêt ?',
      metadata: { timestamp: new Date(), urgencyFlag: false }
    });

    expect(result.intention).toBe('information');
  });

  it('detects urgency cues', async () => {
    const result = await pipeline.process({
      userId: 'u1',
      canal: 'email',
      interlocuteurId: 'i1',
      content: 'URGENT: merci de répondre ASAP',
      metadata: { timestamp: new Date(), urgencyFlag: false }
    });

    expect(['medium', 'high', 'critical']).toContain(result.urgencyLevel);
  });

  it('keeps scores within bounds', async () => {
    const result = await pipeline.process({
      userId: 'u1',
      canal: 'email',
      interlocuteurId: 'i1',
      content: 'Merci pour ton retour',
      metadata: { timestamp: new Date(), urgencyFlag: false }
    });

    expect(result.tensionScore).toBeGreaterThanOrEqual(0);
    expect(result.tensionScore).toBeLessThanOrEqual(1);
  });
});


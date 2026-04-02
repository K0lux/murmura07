import { describe, expect, it } from 'vitest';
import { IngestionPipeline } from '../ingestion.pipeline.js';

const pipeline = new IngestionPipeline();

type GoldenCase = {
  id: string;
  content: string;
  expectedIntention: string;
  expectedEmotion: string[];
  expectedUrgency: string[];
  expectedTensionRange: [number, number];
  expectedAmbiguityRange: [number, number];
};

const goldenCases: GoldenCase[] = [
  {
    id: 'polite-request',
    content: "Peux-tu me dire ce qu'il faut prioriser aujourd'hui ?",
    expectedIntention: 'request',
    expectedEmotion: ['neutral'],
    expectedUrgency: ['low', 'medium'],
    expectedTensionRange: [0, 0.4],
    expectedAmbiguityRange: [0.2, 0.8]
  },
  {
    id: 'urgent-request',
    content: 'URGENT: merci de me confirmer avant 14h sinon on bloque la livraison.',
    expectedIntention: 'request',
    expectedEmotion: ['neutral', 'anger'],
    expectedUrgency: ['high'],
    expectedTensionRange: [0.2, 0.8],
    expectedAmbiguityRange: [0, 0.7]
  },
  {
    id: 'confrontation',
    content: "C'est inacceptable, tu n'as toujours rien livré et ça met tout le projet en retard.",
    expectedIntention: 'confrontation',
    expectedEmotion: ['neutral', 'anger'],
    expectedUrgency: ['low', 'medium', 'high', 'critical'],
    expectedTensionRange: [0.2, 1],
    expectedAmbiguityRange: [0, 0.6]
  },
  {
    id: 'social',
    content: 'Bonjour et merci pour ton aide, bonne journee.',
    expectedIntention: 'social',
    expectedEmotion: ['neutral'],
    expectedUrgency: ['low'],
    expectedTensionRange: [0, 0.3],
    expectedAmbiguityRange: [0, 0.7]
  }
];

describe('IngestionPipeline precision and regression', () => {
  it.each(goldenCases)('keeps predictions stable for $id', async (testCase) => {
    const result = await pipeline.process({
      userId: 'precision-user',
      canal: 'email',
      interlocuteurId: 'contact-1',
      content: testCase.content,
      metadata: { timestamp: new Date('2026-04-02T10:00:00.000Z'), urgencyFlag: false }
    });

    expect(result.intention).toBe(testCase.expectedIntention);
    expect(testCase.expectedEmotion).toContain(result.emotion.dominant);
    expect(testCase.expectedUrgency).toContain(result.urgencyLevel);
    expect(result.tensionScore).toBeGreaterThanOrEqual(testCase.expectedTensionRange[0]);
    expect(result.tensionScore).toBeLessThanOrEqual(testCase.expectedTensionRange[1]);
    expect(result.ambiguityScore).toBeGreaterThanOrEqual(testCase.expectedAmbiguityRange[0]);
    expect(result.ambiguityScore).toBeLessThanOrEqual(testCase.expectedAmbiguityRange[1]);
  });

  it('avoids critical false positives on a benign message', async () => {
    const result = await pipeline.process({
      userId: 'precision-user',
      canal: 'slack',
      interlocuteurId: 'contact-2',
      content: 'Merci pour ton retour, tout est bon pour moi.',
      metadata: { timestamp: new Date('2026-04-02T10:00:00.000Z'), urgencyFlag: false }
    });

    expect(result.intention).not.toBe('threat');
    expect(result.emotion.dominant).not.toBe('anger');
    expect(result.tensionScore).toBeLessThan(0.5);
  });

  it('stays coherent on new noisy phrasing with typos and mixed tone', async () => {
    const result = await pipeline.process({
      userId: 'precision-user',
      canal: 'discord',
      interlocuteurId: 'contact-3',
      content: "salut, tu px me dire vite fait ou on en est plz? it's kinda urgent",
      metadata: { timestamp: new Date('2026-04-02T10:00:00.000Z'), urgencyFlag: false }
    });

    expect(['request', 'information']).toContain(result.intention);
    expect(['medium', 'high', 'critical']).toContain(result.urgencyLevel);
    expect(result.ambiguityScore).toBeLessThanOrEqual(1);
    expect(result.tensionScore).toBeLessThanOrEqual(1);
  });
});

import { apiClient } from './api.client';

export type ApiAnalysis = {
  intention: string;
  emotion: {
    dominant: string;
    intensity: number;
    secondary?: string;
  };
  tensionScore: number;
  explicitDemand: string;
  implicitDemand?: string;
  urgencyLevel: string;
  powerAsymmetry: {
    direction: string;
    intensity: number;
  };
  ambiguityScore: number;
};

export type AnalyzeResponse = {
  requestId: string;
  analysis: ApiAnalysis;
  recommendation: {
    strategy: string;
    rationale: string;
    confidence: number;
    suggestedReply?: string;
  };
  simulations: Array<Record<string, unknown>>;
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    triggeredBy: string;
  }>;
  autonomyAllowed: boolean;
};

export type StoredCognitivePayload = AnalyzeResponse;

export async function analyze(payload: {
  content: string;
  canal: string;
  interlocuteurId: string;
  threadId?: string;
  urgencyFlag?: boolean;
}) {
  return apiClient<AnalyzeResponse>('/v1/analyze', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

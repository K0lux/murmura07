import { apiClient } from './api.client';

export type ApiRelationship = {
  id: string;
  userId: string;
  interlocuteurId: string;
  trustLevel: number;
  accumulatedTension: number;
  powerAsymmetry: {
    direction: string;
    intensity: number;
  };
  interactionFrequency: {
    last7days: number;
    last30days: number;
    averageResponseTime: number;
  };
  sensitiveTopics: string[];
  pendingPromises: Array<{
    id: string;
    description: string;
    dueAt?: string;
    status: 'pending' | 'kept' | 'broken';
  }>;
  relationshipType: string;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
};

export async function getRelationships(params?: { type?: string; sort?: string }) {
  const query = new URLSearchParams();

  if (params?.type) {
    query.set('type', params.type);
  }

  if (params?.sort) {
    query.set('sort', params.sort);
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  return apiClient<ApiRelationship[]>(`/v1/relationships${suffix}`);
}

export async function getRelationshipDetail(id: string) {
  return apiClient<ApiRelationship | null>(`/v1/relationships/${id}`);
}

export async function updateRelationshipNotes(id: string, notes: string) {
  return apiClient<{ notesUpdated: boolean; notesLength: number }>(`/v1/relationships/${id}/notes`, {
    method: 'PATCH',
    body: JSON.stringify({ notes })
  });
}

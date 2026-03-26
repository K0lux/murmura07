import { useEffect, useMemo, useState } from 'react';
import {
  getRelationshipDetail,
  getRelationships,
  updateRelationshipNotes,
  type ApiRelationship
} from '../services/relationships.service';

function formatRelationshipType(type: string) {
  return type
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function useRelationships() {
  const [relationships, setRelationships] = useState<ApiRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextRelationships = await getRelationships({ sort: 'health' });
        if (!cancelled) {
          setRelationships(nextRelationships);
        }
      } catch (caught) {
        if (!cancelled) {
          setRelationships([]);
          setError(caught instanceof Error ? caught.message : 'Chargement des relations impossible.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    relationships,
    isLoading,
    error
  };
}

export function useRelationship(interlocuteurId?: string | null) {
  const [relationship, setRelationship] = useState<ApiRelationship | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(interlocuteurId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interlocuteurId) {
      setRelationship(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextRelationship = await getRelationshipDetail(interlocuteurId);
        if (!cancelled) {
          setRelationship(nextRelationship);
        }
      } catch (caught) {
        if (!cancelled) {
          setRelationship(null);
          setError(caught instanceof Error ? caught.message : 'Chargement de la relation impossible.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [interlocuteurId]);

  const summary = useMemo(() => {
    if (!relationship) {
      return null;
    }

    return {
      id: relationship.interlocuteurId,
      name: relationship.interlocuteurId,
      type: formatRelationshipType(relationship.relationshipType),
      healthScore: relationship.healthScore,
      trustLevel: relationship.trustLevel,
      tension: relationship.accumulatedTension
    };
  }, [relationship]);

  return {
    relationship,
    summary,
    isLoading,
    isSaving,
    error,
    saveNotes: async (notes: string) => {
      if (!interlocuteurId) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        await updateRelationshipNotes(interlocuteurId, notes);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Enregistrement des notes impossible.');
      } finally {
        setIsSaving(false);
      }
    }
  };
}

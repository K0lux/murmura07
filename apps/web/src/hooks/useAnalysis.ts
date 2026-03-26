import { useMemo } from 'react';
import { useMessages } from './useMessages';

export function useAnalysis() {
  const { activeThread, latestAnalysis } = useMessages();

  const analysis = useMemo(() => {
    if (!latestAnalysis) {
      return null;
    }

    return {
      intent: latestAnalysis.analysis.intention,
      tensionScore: latestAnalysis.analysis.tensionScore,
      emotion: latestAnalysis.analysis.emotion.dominant,
      implicitNeed:
        latestAnalysis.analysis.implicitDemand ?? latestAnalysis.analysis.explicitDemand,
      urgencyLevel: latestAnalysis.analysis.urgencyLevel,
      powerDirection: latestAnalysis.analysis.powerAsymmetry.direction,
      ambiguityScore: latestAnalysis.analysis.ambiguityScore,
      interlocuteurId: activeThread?.interlocuteurId ?? null
    };
  }, [activeThread?.interlocuteurId, latestAnalysis]);

  return {
    analysis,
    recommendation: latestAnalysis?.recommendation ?? null,
    alerts: latestAnalysis?.alerts ?? [],
    autonomyAllowed: latestAnalysis?.autonomyAllowed ?? false,
    isLoading: false
  };
}

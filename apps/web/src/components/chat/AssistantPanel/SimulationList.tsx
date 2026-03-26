import { Badge } from '../../ui/Badge';
import { useAnalysis } from '../../../hooks/useAnalysis';

export function SimulationList() {
  const { analysis } = useAnalysis();

  if (!analysis) {
    return null;
  }

  const scenarios = [
    {
      name: 'Apaisement',
      acceptance: Math.max(0.45, 1 - analysis.tensionScore * 0.4)
    },
    {
      name: 'Clarification',
      acceptance: Math.max(0.35, 1 - analysis.ambiguityScore * 0.3)
    },
    {
      name: 'Reponse directe',
      acceptance: Math.max(0.2, 0.8 - analysis.tensionScore * 0.5)
    }
  ];

  return (
    <div className="card stack">
      <strong>Simulations</strong>
      {scenarios.map((scenario) => (
        <div key={scenario.name} className="row-between">
          <span>{scenario.name}</span>
          <Badge tone={scenario.acceptance > 0.7 ? 'success' : 'warning'}>
            {Math.round(scenario.acceptance * 100)}% acceptation
          </Badge>
        </div>
      ))}
    </div>
  );
}

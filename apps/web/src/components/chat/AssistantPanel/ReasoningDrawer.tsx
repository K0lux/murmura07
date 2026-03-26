import { Drawer } from '../../ui/Drawer';
import { useAnalysis } from '../../../hooks/useAnalysis';

export function ReasoningDrawer() {
  const { analysis } = useAnalysis();

  if (!analysis) {
    return null;
  }

  return (
    <Drawer open title="Raisonnement Murmura">
      <div>1. Intention dominante detectee: {analysis.intent}.</div>
      <div>
        2. Emotion dominante: {analysis.emotion} avec une tension estimee a{' '}
        {Math.round(analysis.tensionScore * 100)} / 100.
      </div>
      <div>3. Demande prioritaire a traiter: {analysis.implicitNeed}.</div>
    </Drawer>
  );
}

export class MetricsCalculator {
  apply(current: { trust: number; tension: number }, signal: { tensionScore?: number }) {
    const tensionDelta = signal.tensionScore ? Math.max(0, signal.tensionScore - 0.5) * 0.1 : 0;
    const trustDelta = signal.tensionScore && signal.tensionScore > 0.7 ? -0.05 : 0.02;
    return { trustDelta, tensionDelta };
  }
}

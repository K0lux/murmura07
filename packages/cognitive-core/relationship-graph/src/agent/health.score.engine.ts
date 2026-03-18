export class HealthScoreEngine {
  compute(trust: number, tension: number, frequencyScore: number, promiseRatio: number) {
    return trust * 40 + (1 - tension) * 25 + frequencyScore * 15 + promiseRatio * 20;
  }
}

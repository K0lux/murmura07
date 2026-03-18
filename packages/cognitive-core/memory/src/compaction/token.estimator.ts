export class TokenEstimator {
  estimate(content: string): number {
    return Math.ceil(content.length / 4);
  }
}

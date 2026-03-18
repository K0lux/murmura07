export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private lastFailureAt = 0;

  constructor(
    private readonly threshold = 5,
    private readonly windowMs = 10000,
    private readonly recoveryMs = 5000
  ) {}

  canExecute(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureAt > this.recoveryMs) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true;
  }

  onSuccess() {
    this.state = 'CLOSED';
    this.failures = 0;
  }

  onFailure() {
    const now = Date.now();
    if (now - this.lastFailureAt > this.windowMs) {
      this.failures = 0;
    }
    this.failures += 1;
    this.lastFailureAt = now;

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

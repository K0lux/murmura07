import { describe, expect, it, vi } from 'vitest';
import { CircuitBreaker } from '../orchestrator/circuit.breaker.js';

describe('CircuitBreaker', () => {
  it('opens after the configured threshold and blocks until recovery', () => {
    vi.useFakeTimers();

    const breaker = new CircuitBreaker(2, 10_000, 5_000);

    expect(breaker.canExecute()).toBe(true);
    breaker.onFailure();
    expect(breaker.canExecute()).toBe(true);

    breaker.onFailure();
    expect(breaker.canExecute()).toBe(false);

    vi.advanceTimersByTime(5_001);
    expect(breaker.canExecute()).toBe(true);

    vi.useRealTimers();
  });

  it('resets failures after a successful execution and after the failure window elapses', () => {
    vi.useFakeTimers();

    const breaker = new CircuitBreaker(2, 1_000, 5_000);

    breaker.onFailure();
    breaker.onSuccess();
    expect(breaker.canExecute()).toBe(true);

    breaker.onFailure();
    vi.advanceTimersByTime(1_100);
    breaker.onFailure();

    expect(breaker.canExecute()).toBe(true);

    vi.useRealTimers();
  });
});

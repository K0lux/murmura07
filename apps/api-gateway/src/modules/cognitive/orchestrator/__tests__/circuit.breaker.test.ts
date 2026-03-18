import { describe, expect, it, vi } from 'vitest';
import { CircuitBreaker } from '../circuit.breaker.js';

describe('CircuitBreaker', () => {
  it('opens after threshold failures and half-opens after recovery', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const breaker = new CircuitBreaker(2, 10000, 5000);

    breaker.onFailure();
    breaker.onFailure();

    expect(breaker.getState()).toBe('OPEN');
    expect(breaker.canExecute()).toBe(false);

    vi.setSystemTime(new Date('2026-01-01T00:00:06Z'));
    expect(breaker.canExecute()).toBe(true);
    expect(breaker.getState()).toBe('HALF_OPEN');

    breaker.onSuccess();
    expect(breaker.getState()).toBe('CLOSED');

    vi.useRealTimers();
  });
});


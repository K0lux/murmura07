const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries: number; baseDelayMs: number }
): Promise<T> {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= options.retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === options.retries) {
        break;
      }
      const delay = options.baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
      attempt += 1;
    }
  }

  throw lastError;
}

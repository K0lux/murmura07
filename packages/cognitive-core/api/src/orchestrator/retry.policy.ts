const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(fn: () => Promise<T>, retries = 2, baseDelayMs = 1000): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
      attempt += 1;
    }
  }
}

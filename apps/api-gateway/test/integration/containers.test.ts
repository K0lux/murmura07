import { describe, expect, it } from 'vitest';
import { GenericContainer } from 'testcontainers';

const runIntegration = process.env.RUN_INTEGRATION === '1';

const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration('Integration containers', () => {
  it('starts postgres and redis containers', async () => {
    try {
      const postgres = await new GenericContainer('postgres:16-alpine')
        .withEnvironment({
          POSTGRES_USER: 'murmura',
          POSTGRES_PASSWORD: 'murmura',
          POSTGRES_DB: 'api_gateway_test'
        })
        .withExposedPorts(5432)
        .start();

      const redis = await new GenericContainer('redis:7-alpine')
        .withExposedPorts(6379)
        .start();

      expect(postgres.getHost()).toBeTruthy();
      expect(redis.getHost()).toBeTruthy();

      await postgres.stop();
      await redis.stop();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!process.env.CI && message.includes('working container runtime strategy')) {
        return;
      }
      throw error;
    }
  }, 120000);
});

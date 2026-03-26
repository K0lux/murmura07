import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      include: ['src/routes/**/*.ts', 'src/plugins/**/*.ts', 'src/orchestrator/**/*.ts'],
      exclude: ['src/types/**/*.d.ts'],
      lines: 95,
      functions: 95,
      branches: 79,
      statements: 95
    }
  }
});

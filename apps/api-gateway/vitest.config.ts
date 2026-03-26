import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      include: [
        'src/app.controller.ts',
        'src/modules/auth/auth.service.ts',
        'src/common/guards/jwt-auth.guard.ts',
        'src/common/guards/rate-limit.guard.ts'
      ],
      lines: 95,
      functions: 95,
      branches: 73,
      statements: 95
    }
  }
});

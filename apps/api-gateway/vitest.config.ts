import { defineConfig } from 'vitest/config';

const shared = {
  environment: 'node' as const
};

export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  test: {
    ...shared,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      include: [
        'src/**/*.ts',
        'test/**/*.ts'
      ],
      exclude: [
        'src/main.ts'
      ],
      lines: 85,
      functions: 85,
      branches: 70,
      statements: 85
    }
  },
  projects: [
    {
      test: {
        ...shared,
        name: 'unit',
        include: ['src/**/*.test.ts']
      }
    },
    {
      test: {
        ...shared,
        name: 'api',
        include: ['test/api/**/*.test.ts']
      }
    },
    {
      test: {
        ...shared,
        name: 'security',
        include: ['test/security/**/*.test.ts']
      }
    },
    {
      test: {
        ...shared,
        name: 'performance',
        include: ['test/performance/**/*.test.ts']
      }
    },
    {
      test: {
        ...shared,
        name: 'e2e',
        include: ['test/e2e/**/*.test.ts']
      }
    }
  ]
});

module.exports = {
  packageManager: 'pnpm',
  testRunner: 'command',
  commandRunner: {
    command: 'pnpm exec vitest run --workspace vitest.workspace.ts --reporter dot'
  },
  reporters: ['clear-text', 'html', 'progress'],
  coverageAnalysis: 'off',
  tsconfigFile: 'tsconfig.base.json',
  mutate: [
    'packages/cognitive-core/relationship-graph/src/agent/health.score.engine.ts',
    'packages/cognitive-core/relationship-graph/src/updater/decay.scheduler.ts',
    'packages/cognitive-core/simulation-engine/src/simulation/scenario.ranker.ts',
    '!**/*.test.ts'
  ],
  checkers: ['typescript'],
  thresholds: {
    high: 85,
    low: 75,
    break: 75
  }
};

module.exports = {
  packageManager: 'pnpm',
  testRunner: 'command',
  commandRunner: {
    command: 'pnpm -w exec vitest run --reporter dot'
  },
  reporters: ['clear-text', 'html', 'progress'],
  coverageAnalysis: 'off',
  tsconfigFile: 'tsconfig.base.json',
  mutate: [
    'packages/cognitive-core/**/*.ts',
    '!**/*.test.ts'
  ],
  checkers: ['typescript']
};

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const targets = [
  'packages/cognitive-core/api',
  'packages/cognitive-core/shared',
  'packages/cognitive-core/ingestion',
  'packages/cognitive-core/memory',
  'packages/cognitive-core/context-engine',
  'packages/cognitive-core/governance',
  'packages/cognitive-core/decision-engine',
  'packages/cognitive-core/identity-model',
  'packages/cognitive-core/relationship-graph',
  'packages/cognitive-core/reasoning-engine',
  'packages/cognitive-core/simulation-engine',
  'apps/api-gateway'
];

const forwardedArgs = process.argv.slice(2);
const rootDir = process.cwd();

function resolvePnpmExecutable() {
  if (process.platform !== 'win32') {
    return 'pnpm';
  }

  const candidates = [
    process.env['PNPM_EXE'],
    process.env['npm_execpath'],
    process.env['APPDATA'] ? path.join(process.env['APPDATA'], 'npm', 'pnpm.cmd') : undefined,
    'C:\\Program Files\\nodejs\\pnpm.CMD',
    'pnpm.cmd'
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  for (const candidate of candidates) {
    if (candidate.toLowerCase().endsWith('.cmd')) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
      continue;
    }

    return candidate;
  }

  return 'pnpm.cmd';
}

const pnpmExecutable = resolvePnpmExecutable();

for (const target of targets) {
  const cwd = path.resolve(rootDir, target);
  console.log(`\n[vitest-workspace] running ${target}`);
  const result = spawnSync(pnpmExecutable, ['exec', 'vitest', 'run', ...forwardedArgs], {
    cwd,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(`[vitest-workspace] failed to start for ${target}`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

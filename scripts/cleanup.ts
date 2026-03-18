import fs from 'node:fs/promises';
import path from 'node:path';

async function safeRm(target: string) {
  await fs.rm(target, { recursive: true, force: true });
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cleanup is blocked in production.');
  }

  const workspaceRoot = path.resolve('workspace-template');
  const reports = path.resolve('reports');

  await safeRm(reports);
  await fs.mkdir(workspaceRoot, { recursive: true });

  console.log('Cleanup done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

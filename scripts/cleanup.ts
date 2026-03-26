import fs from 'node:fs/promises';
import path from 'node:path';

async function safeRm(target: string) {
  await fs.rm(target, { recursive: true, force: true });
}

async function main() {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('Cleanup is blocked in production.');
  }

  const reports = path.resolve('reports');
  const localState = path.resolve('.murmura');
  const temporaryWorkspaceRoots = [
    path.join(localState, 'workspaces'),
    path.join(localState, 'eval-workspaces'),
    path.join(localState, 'memory')
  ];
  const legacyWorkspaceRoots = [
    path.resolve('workspace-template', 'user_test'),
    path.resolve('workspace-template', 'dev-seed-workspaces')
  ];

  await safeRm(reports);
  await Promise.all([...temporaryWorkspaceRoots, ...legacyWorkspaceRoots].map((target) => safeRm(target)));
  await fs.mkdir(localState, { recursive: true });

  console.log('Cleanup done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

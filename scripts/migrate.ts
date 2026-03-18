import { execSync } from 'node:child_process';

function run(cmd: string) {
  execSync(cmd, { stdio: 'inherit' });
}

run('pnpm -C apps/api-gateway prisma migrate deploy --schema prisma/schema.prisma');

console.log('Prisma migrations applied.');

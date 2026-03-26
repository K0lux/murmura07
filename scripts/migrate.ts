import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const memoryRoot = path.resolve('.murmura', 'memory');
const sqliteDbPath = path.join(memoryRoot, 'memory.db');
const migrationsDir = path.resolve('packages', 'cognitive-core', 'memory', 'src', 'db', 'migrations');
const pnpmBin = process.platform === 'win32' ? 'pnpm.CMD' : 'pnpm';
const sqliteBin = process.platform === 'win32' ? 'sqlite3.exe' : 'sqlite3';

function run(command: string, args: string[], cwd = process.cwd()) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function hasSqliteCli() {
  const result = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['sqlite3'], {
    stdio: 'ignore'
  });
  return result.status === 0;
}

async function applySqliteMigrations() {
  await fs.mkdir(memoryRoot, { recursive: true });

  const entries = await fs.readdir(migrationsDir);
  const migrationFiles = entries.filter((entry) => entry.endsWith('.sql')).sort();
  const appliedMigrationsPath = path.join(memoryRoot, '.applied-migrations.json');

  let appliedMigrations: string[] = [];
  try {
    appliedMigrations = JSON.parse(await fs.readFile(appliedMigrationsPath, 'utf8')) as string[];
  } catch {
    appliedMigrations = [];
  }

  const pendingMigrations = migrationFiles.filter((file) => !appliedMigrations.includes(file));
  if (pendingMigrations.length === 0) {
    console.log('Memory SQLite migrations already up to date.');
    return;
  }

  if (!hasSqliteCli()) {
    const bundlePath = path.join(memoryRoot, 'pending-migrations.sql');
    const bundle = await Promise.all(
      pendingMigrations.map(async (file) => {
        const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
        return `-- ${file}\n${sql.trim()}\n`;
      })
    );

    await fs.writeFile(bundlePath, bundle.join('\n'), 'utf8');
    console.warn(
      `sqlite3 CLI not found. Pending memory migrations were bundled to ${bundlePath} but not executed.`
    );
    return;
  }

  for (const file of pendingMigrations) {
    const sqlPath = path.join(migrationsDir, file);
    console.log(`Applying memory migration ${file}`);
    run(sqliteBin, [sqliteDbPath, `.read ${sqlPath}`]);
    appliedMigrations.push(file);
  }

  await fs.writeFile(appliedMigrationsPath, JSON.stringify(appliedMigrations, null, 2), 'utf8');
  console.log(`Memory SQLite migrations applied to ${sqliteDbPath}.`);
}

async function main() {
  run(pnpmBin, ['-C', 'apps/api-gateway', 'prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma']);
  console.log('Prisma migrations applied.');

  await applySqliteMigrations();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { existsSync } from 'node:fs';
import path from 'node:path';
import { FastifyInstance } from 'fastify';

type HealthCheckStatus = 'up' | 'down';

type HealthCheckResult = {
  status: HealthCheckStatus;
  message?: string;
};

type HealthRouteOptions = {
  checks?: Record<string, () => Promise<HealthCheckResult> | HealthCheckResult>;
};

export async function healthRoute(app: FastifyInstance, options: HealthRouteOptions = {}) {
  app.get('/', async () => {
    const checks = options.checks ?? defaultChecks();
    const results: Record<string, HealthCheckResult> = {};

    for (const [name, check] of Object.entries(checks)) {
      try {
        results[name] = await check();
      } catch (error) {
        results[name] = {
          status: 'down',
          message: error instanceof Error ? error.message : 'Unknown health check error'
        };
      }
    }

    const status = Object.values(results).every((result) => result.status === 'up')
      ? 'ok'
      : 'degraded';

    return {
      status,
      checks: results
    };
  });
}

function defaultChecks(): Record<string, () => HealthCheckResult> {
  return {
    api: () => ({ status: 'up' }),
    authConfig: () =>
      process.env['JWT_ACCESS_SECRET'] && process.env['JWT_REFRESH_SECRET']
        ? { status: 'up' }
        : { status: 'down', message: 'JWT secrets are not fully configured' },
    workspaceTemplate: () =>
      resolveWorkspaceTemplate()
        ? { status: 'up' }
        : { status: 'down', message: 'workspace-template directory not found' }
  };
}

function resolveWorkspaceTemplate() {
  const candidates = [
    path.resolve(process.cwd(), 'workspace-template'),
    path.resolve(process.cwd(), '..', 'workspace-template'),
    path.resolve(process.cwd(), '..', '..', 'workspace-template'),
    path.resolve(process.cwd(), '..', '..', '..', 'workspace-template')
  ];

  return candidates.some((candidate) => existsSync(candidate));
}

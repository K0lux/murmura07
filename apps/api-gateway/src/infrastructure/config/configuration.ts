export interface MurmuraConfiguration {
  app: {
    port: number;
    env: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessTtl: string;
    refreshTtl: string;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  openclaw: {
    baseUrl: string;
    timeoutMs: number;
  };
}

export function getConfiguration(): MurmuraConfiguration {
  return {
    app: {
      port: Number(process.env['PORT'] ?? 3000),
      env: process.env['NODE_ENV'] ?? 'development'
    },
    jwt: {
      accessSecret: process.env['JWT_ACCESS_SECRET'] ?? 'dev_access_secret',
      refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'dev_refresh_secret',
      accessTtl: process.env['JWT_ACCESS_TTL'] ?? '15m',
      refreshTtl: process.env['JWT_REFRESH_TTL'] ?? '30d'
    },
    database: {
      url: process.env['DATABASE_URL'] ?? ''
    },
    redis: {
      url: process.env['REDIS_URL'] ?? 'redis://localhost:6379'
    },
    openclaw: {
      baseUrl: process.env['OPENCLAW_BASE_URL'] ?? 'http://localhost:3010',
      timeoutMs: Number(process.env['OPENCLAW_TIMEOUT_MS'] ?? 10000)
    }
  };
}

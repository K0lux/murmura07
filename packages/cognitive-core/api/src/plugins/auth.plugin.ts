import crypto from 'node:crypto';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import type { AutonomyConfig } from '@murmura/cognitive-core-shared';
import { WorkspaceManager } from '@murmura/cognitive-core-memory';

async function authPluginHandler(app: FastifyInstance) {
  app.decorateRequest('user', null);
  app.decorateReply('issueTokens', function issueTokens(identity) {
    const accessSecret = process.env['JWT_ACCESS_SECRET'] ?? 'dev_access_secret';
    const refreshSecret = process.env['JWT_REFRESH_SECRET'] ?? 'dev_refresh_secret';
    const accessTtl = process.env['JWT_ACCESS_TTL'] ?? '15m';
    const refreshTtl = process.env['JWT_REFRESH_TTL'] ?? '30d';
    const workspace = identity.workspace ?? `workspace/${identity.userId}`;
    const autonomyConfig =
      identity.autonomyConfig ?? defaultAutonomyConfig(identity.userId);
    const permissions = identity.permissions ?? ['analyze:read', 'memory:read'];
    const accessTokenId = crypto.randomBytes(8).toString('hex');
    const refreshTokenId = crypto.randomBytes(16).toString('hex');

    const accessToken = jwt.sign(
      {
        sub: identity.userId,
        type: 'access',
        jti: accessTokenId,
        permissions,
        workspace,
        autonomyConfig
      },
      accessSecret,
      { expiresIn: accessTtl }
    );

    const refreshToken = jwt.sign(
      {
        sub: identity.userId,
        type: 'refresh',
        jti: refreshTokenId,
        permissions,
        workspace,
        autonomyConfig
      },
      refreshSecret,
      { expiresIn: refreshTtl }
    );

    const refreshExpiresAt = getExpiryDate(refreshTtl);
    refreshTokenStore.set(refreshTokenId, {
      refreshToken,
      userId: identity.userId,
      permissions,
      workspace,
      autonomyConfig,
      expiresAt: refreshExpiresAt
    });

    return { accessToken, refreshToken, refreshExpiresAt };
  });
  app.decorateReply('rotateRefreshToken', function rotateRefreshToken(refreshToken) {
    const refreshSecret = process.env['JWT_REFRESH_SECRET'] ?? 'dev_refresh_secret';

    try {
      const payload = parseJwtPayload(jwt.verify(refreshToken, refreshSecret));
      if (payload.type !== 'refresh' || !payload.jti) {
        return null;
      }

      const stored = refreshTokenStore.get(payload.jti);
      if (!stored || stored.refreshToken !== refreshToken || stored.expiresAt.getTime() <= Date.now()) {
        refreshTokenStore.delete(payload.jti);
        return null;
      }

      refreshTokenStore.delete(payload.jti);
      return this.issueTokens({
        userId: stored.userId,
        permissions: stored.permissions,
        workspace: stored.workspace,
        autonomyConfig: stored.autonomyConfig
      });
    } catch {
      return null;
    }
  });
  app.decorateReply('revokeRefreshToken', function revokeRefreshToken(refreshToken) {
    for (const [refreshTokenId, session] of refreshTokenStore.entries()) {
      if (session.refreshToken === refreshToken) {
        refreshTokenStore.delete(refreshTokenId);
        return true;
      }
    }

    return false;
  });

  app.addHook('preHandler', async (request, reply) => {
    if (
      request.url.startsWith('/docs') ||
      request.url.startsWith('/openapi.json') ||
      request.url.startsWith('/v1/health')
    ) {
      return;
    }

    const header = request.headers.authorization;
    if (!header) {
      reply.code(401).send({ error: 'Missing Authorization header' });
      return;
    }

    const [, token] = header.split(' ');
    if (!token) {
      reply.code(401).send({ error: 'Invalid Authorization header' });
      return;
    }

    try {
      const payload = parseJwtPayload(
        jwt.verify(token, process.env['JWT_ACCESS_SECRET'] ?? 'dev_access_secret')
      );
      if (payload.type !== 'access' || !payload.sub) {
        reply.code(401).send({ error: 'Invalid token type' });
        return;
      }

      const workspaceManager = new WorkspaceManager();
      const workspacePath = await workspaceManager.ensureWorkspace(payload.sub);

      request.user = {
        userId: payload.sub,
        permissions: payload.permissions ?? [],
        workspace: payload.workspace ?? workspacePath,
        autonomyConfig: payload.autonomyConfig ?? defaultAutonomyConfig(payload.sub),
        ...(payload.jti ? { accessTokenId: payload.jti } : {})
      };
    } catch {
      reply.code(401).send({ error: 'Invalid token' });
    }
  });
}

export const authPlugin = fp(authPluginHandler, { name: 'auth-plugin' });

type JwtPayload = {
  sub?: string;
  type?: string;
  jti?: string;
  permissions?: string[];
  workspace?: string;
  autonomyConfig?: AutonomyConfig;
};

type StoredRefreshSession = {
  refreshToken: string;
  userId: string;
  permissions: string[];
  workspace: string;
  autonomyConfig: AutonomyConfig;
  expiresAt: Date;
};

const refreshTokenStore = new Map<string, StoredRefreshSession>();

function parseJwtPayload(value: string | Record<string, unknown>): JwtPayload {
  if (typeof value === 'string') {
    return {};
  }

  const payload: JwtPayload = {};

  if (typeof value['sub'] === 'string') {
    payload.sub = value['sub'];
  }
  if (typeof value['type'] === 'string') {
    payload.type = value['type'];
  }
  if (typeof value['jti'] === 'string') {
    payload.jti = value['jti'];
  }
  if (Array.isArray(value['permissions'])) {
    payload.permissions = value['permissions'].filter(
      (permission): permission is string => typeof permission === 'string'
    );
  }
  if (typeof value['workspace'] === 'string') {
    payload.workspace = value['workspace'];
  }
  if (isAutonomyConfig(value['autonomyConfig'])) {
    payload.autonomyConfig = value['autonomyConfig'];
  }

  return payload;
}

function isAutonomyConfig(value: unknown): value is AutonomyConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as {
    userId?: unknown;
    defaultLevel?: unknown;
    rules?: unknown;
  };

  return (
    typeof candidate.userId === 'string' &&
    typeof candidate.defaultLevel === 'string' &&
    Array.isArray(candidate.rules)
  );
}

function defaultAutonomyConfig(userId: string): AutonomyConfig {
  return {
    userId,
    defaultLevel: 'suggestion_only',
    rules: []
  };
}

function getExpiryDate(ttl: string) {
  const now = new Date();
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  const unit = match[2];
  const amount = match[1];
  if (!unit || !amount) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  const multiplier =
    unit === 's'
      ? 1000
      : unit === 'm'
        ? 60 * 1000
        : unit === 'h'
          ? 60 * 60 * 1000
          : unit === 'd'
            ? 24 * 60 * 60 * 1000
            : null;

  if (multiplier === null) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  return new Date(now.getTime() + Number(amount) * multiplier);
}

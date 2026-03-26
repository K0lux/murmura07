import 'fastify';
import type { ZodSchema } from 'zod';
import type { AutonomyConfig } from '@murmura/cognitive-core-shared';

export type AuthenticatedRequestContext = {
  userId: string;
  permissions: string[];
  workspace: string;
  autonomyConfig: AutonomyConfig;
  accessTokenId?: string;
};

export type RefreshSession = {
  refreshToken: string;
  accessToken: string;
  refreshExpiresAt: Date;
};

export type ValidationErrorDetail = {
  path: string;
  reason: string;
};

export type ValidationFailure = Error & {
  statusCode: number;
  code: 'VALIDATION_ERROR';
  details: ValidationErrorDetail[];
};

export type RequestSpan = {
  traceId: string;
  spanId: string;
  name: string;
  startedAt: number;
  attributes: Record<string, string | number | boolean>;
  setAttribute: (key: string, value: string | number | boolean) => void;
  end: (outcome?: { statusCode?: number; error?: unknown }) => void;
};

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthenticatedRequestContext | null;
    span: RequestSpan | null;
  }

  interface FastifyReply {
    issueTokens: (identity: {
      userId: string;
      permissions?: string[];
      workspace?: string;
      autonomyConfig?: AutonomyConfig;
    }) => RefreshSession;
    rotateRefreshToken: (refreshToken: string) => RefreshSession | null;
    revokeRefreshToken: (refreshToken: string) => boolean;
  }

  interface FastifyInstance {
    validateBody: <T>(schema: ZodSchema<T>, body: unknown) => T;
    validateQuery: <T>(schema: ZodSchema<T>, query: unknown) => T;
    validateParams: <T>(schema: ZodSchema<T>, params: unknown) => T;
    validateResponse: <T>(schema: ZodSchema<T>, payload: unknown) => T;
  }
}

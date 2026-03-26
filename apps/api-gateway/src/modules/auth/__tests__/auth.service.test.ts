import { BadRequestException, HttpException, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../auth.service.js';

type UserRecord = {
  id: string;
  email: string;
  phoneNumber: string | null;
  phoneVerifiedAt: Date | null;
  passwordHash: string;
  passwordSalt: string;
};

type RefreshTokenRecord = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

function createRedisMock() {
  const values = new Map<string, { value: string; expiresAt?: number }>();

  const ensureAlive = (key: string) => {
    const record = values.get(key);
    if (!record) {
      return null;
    }
    if (record.expiresAt && record.expiresAt <= Date.now()) {
      values.delete(key);
      return null;
    }
    return record;
  };

  return {
    values,
    async get(key: string) {
      return ensureAlive(key)?.value ?? null;
    },
    async set(key: string, value: string, ttlSeconds?: number) {
      values.set(key, {
        value,
        ...(ttlSeconds ? { expiresAt: Date.now() + ttlSeconds * 1000 } : {})
      });
    },
    async incr(key: string) {
      const current = Number((await this.get(key)) ?? '0') + 1;
      await this.set(key, String(current));
      return current;
    },
    async expire(key: string, ttlSeconds: number) {
      const record = ensureAlive(key);
      if (record) {
        record.expiresAt = Date.now() + ttlSeconds * 1000;
      }
    },
    async ttl(key: string) {
      const record = ensureAlive(key);
      if (!record?.expiresAt) {
        return -1;
      }
      return Math.max(0, Math.ceil((record.expiresAt - Date.now()) / 1000));
    },
    async del(key: string) {
      values.delete(key);
    },
    async ping() {
      return 'PONG';
    }
  };
}

function createPrismaMock() {
  const users: UserRecord[] = [];
  const refreshTokens: RefreshTokenRecord[] = [];
  let userId = 1;
  let refreshTokenId = 1;

  return {
    state: {
      users,
      refreshTokens
    },
    user: {
      async findUnique({ where: { email } }: { where: { email: string } }) {
        return users.find((user) => user.email === email) ?? null;
      },
      async findFirst({
        where
      }: {
        where: {
          phoneNumber: string;
          NOT?: { id: string };
        };
        select?: { id: true };
      }) {
        return (
          users.find(
            (user) => user.phoneNumber === where.phoneNumber && user.id !== where.NOT?.id
          ) ?? null
        );
      },
      async create({
        data
      }: {
        data: {
          email: string;
          passwordHash: string;
          passwordSalt: string;
        };
      }) {
        const user: UserRecord = {
          id: `user-${userId++}`,
          email: data.email,
          passwordHash: data.passwordHash,
          passwordSalt: data.passwordSalt,
          phoneNumber: null,
          phoneVerifiedAt: null
        };
        users.push(user);
        return user;
      },
      async update({
        where: { id },
        data,
        select
      }: {
        where: { id: string };
        data: Partial<UserRecord>;
        select?: Record<string, boolean>;
      }) {
        const user = users.find((candidate) => candidate.id === id);
        if (!user) {
          throw new Error('User not found');
        }
        Object.assign(user, data);
        if (!select) {
          return user;
        }
        const selected: Record<string, unknown> = {};
        for (const key of Object.keys(select)) {
          selected[key] = user[key as keyof UserRecord];
        }
        return selected;
      }
    },
    refreshToken: {
      async create({
        data
      }: {
        data: { userId: string; token: string; expiresAt: Date };
      }) {
        const token: RefreshTokenRecord = {
          id: `refresh-${refreshTokenId++}`,
          userId: data.userId,
          token: data.token,
          expiresAt: data.expiresAt,
          revokedAt: null,
          createdAt: new Date()
        };
        refreshTokens.push(token);
        return token;
      },
      async findUnique({ where: { token } }: { where: { token: string } }) {
        return refreshTokens.find((candidate) => candidate.token === token) ?? null;
      },
      async update({
        where: { token },
        data
      }: {
        where: { token: string };
        data: Partial<RefreshTokenRecord>;
      }) {
        const existing = refreshTokens.find((candidate) => candidate.token === token);
        if (!existing) {
          throw new Error('Refresh token not found');
        }
        Object.assign(existing, data);
        return existing;
      },
      async updateMany({
        where,
        data
      }: {
        where: { userId: string; token: string };
        data: Partial<RefreshTokenRecord>;
      }) {
        let count = 0;
        for (const existing of refreshTokens) {
          if (existing.userId === where.userId && existing.token === where.token) {
            Object.assign(existing, data);
            count += 1;
          }
        }
        return { count };
      }
    }
  };
}

describe('AuthService', () => {
  beforeEach(() => {
    process.env['JWT_ACCESS_SECRET'] = 'unit_access_secret';
    process.env['JWT_REFRESH_SECRET'] = 'unit_refresh_secret';
    process.env['JWT_ACCESS_TTL'] = '15m';
    process.env['JWT_REFRESH_TTL'] = '30d';
    process.env['NODE_ENV'] = 'test';
  });

  it('registers a user and rejects duplicates', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);

    const user = await service.register('alice@example.com', 'P@ssword123');

    expect(user.email).toBe('alice@example.com');
    await expect(service.register('alice@example.com', 'P@ssword123')).rejects.toThrow(
      new UnauthorizedException('User already exists')
    );
  });

  it('runs the login, refresh and logout lifecycle with persisted refresh tokens', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);

    await service.register('bob@example.com', 'P@ssword123');
    const login = await service.login('bob@example.com', 'P@ssword123');

    expect(login.accessToken).toBeTruthy();
    expect(login.refreshToken).toBeTruthy();
    expect(prisma.state.refreshTokens).toHaveLength(1);

    const refreshed = await service.refresh(login.refreshToken);

    expect(refreshed.accessToken).toBeTruthy();
    expect(refreshed.refreshToken).not.toBe(login.refreshToken);
    expect(prisma.state.refreshTokens).toHaveLength(2);
    expect(prisma.state.refreshTokens[0]?.revokedAt).toBeInstanceOf(Date);

    await expect(service.refresh(login.refreshToken)).rejects.toThrow(
      new UnauthorizedException('Refresh token revoked')
    );

    await expect(service.logout(refreshed.refreshToken)).resolves.toEqual({ loggedOut: true });
    await expect(service.refresh(refreshed.refreshToken)).rejects.toThrow(
      new UnauthorizedException('Refresh token revoked')
    );
  });

  it('rejects invalid login credentials', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);

    await service.register('charlie@example.com', 'P@ssword123');

    await expect(service.login('charlie@example.com', 'wrong-password')).rejects.toThrow(
      new UnauthorizedException('Invalid credentials')
    );
  });

  it('validates users with the stored password hash', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);

    await service.register('frank@example.com', 'P@ssword123');

    await expect(service.validateUser('frank@example.com', 'P@ssword123')).resolves.toMatchObject({
      email: 'frank@example.com'
    });
    await expect(service.validateUser('frank@example.com', 'wrong')).resolves.toBeNull();
    await expect(service.validateUser('missing@example.com', 'P@ssword123')).resolves.toBeNull();
  });

  it('issues and verifies phone OTP codes', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);
    const user = await service.register('dina@example.com', 'P@ssword123');

    const otpRequest = await service.requestPhoneVerificationOtp(user.id, '+22890123456');

    expect(otpRequest.phoneNumber).toBe('+22890123456');
    expect(otpRequest.otp).toHaveLength(6);

    const verification = await service.verifyPhoneOtp(
      user.id,
      '+22890123456',
      otpRequest.otp ?? ''
    );

    expect(verification.verified).toBe(true);
    expect(verification.user.phoneNumber).toBe('+22890123456');
  });

  it('rejects invalid OTP payloads and resend storms', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);
    const user = await service.register('eve@example.com', 'P@ssword123');

    await expect(service.requestPhoneVerificationOtp(user.id, '090123456')).rejects.toThrow(
      new BadRequestException('Phone number must use E.164 format')
    );

    const request = await service.requestPhoneVerificationOtp(user.id, '+22899112233');

    await expect(service.requestPhoneVerificationOtp(user.id, '+22899112233')).rejects.toThrow(
      new HttpException('Please wait 60s before requesting another OTP', 429)
    );

    await expect(service.verifyPhoneOtp(user.id, '+22899112233', '000000')).rejects.toThrow(
      new BadRequestException('Invalid OTP code')
    );
    await expect(service.verifyPhoneOtp(user.id, '+22899112233', request.otp ?? '')).resolves.toMatchObject(
      {
        verified: true
      }
    );
  });

  it('rejects OTP verification for the wrong phone number and duplicate phone ownership', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);
    const user = await service.register('gina@example.com', 'P@ssword123');
    const other = await service.register('henri@example.com', 'P@ssword123');

    await prisma.user.update({
      where: { id: user.id },
      data: { phoneNumber: '+22888776655' }
    });

    await expect(service.requestPhoneVerificationOtp(other.id, '+22888776655')).rejects.toThrow(
      new BadRequestException('Phone number is already used by another account')
    );
    await service.requestPhoneVerificationOtp(user.id, '+22899001122');
    await expect(service.verifyPhoneOtp(user.id, '+22812345678', '123456')).rejects.toThrow(
      new BadRequestException('OTP does not match this phone number')
    );
  });

  it('rejects expired refresh tokens and invalid access token types', async () => {
    const prisma = createPrismaMock();
    const redis = createRedisMock();
    const service = new AuthService(prisma as never, redis as never);

    await service.register('iris@example.com', 'P@ssword123');
    const login = await service.login('iris@example.com', 'P@ssword123');
    prisma.state.refreshTokens[0]!.expiresAt = new Date(Date.now() - 60_000);

    await expect(service.refresh(login.refreshToken)).rejects.toThrow(
      new UnauthorizedException('Refresh token expired')
    );

    const wrongTypeAccessToken = jwt.sign(
      { sub: 'user-test', type: 'refresh' },
      process.env['JWT_ACCESS_SECRET'] ?? 'unit_access_secret'
    );

    await expect(() => service.verifyAccessToken(wrongTypeAccessToken)).toThrow(
      new UnauthorizedException('Invalid token type')
    );
  });
});

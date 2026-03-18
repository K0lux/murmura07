import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { RedisService } from '../../infrastructure/redis/redis.service.js';

interface JwtPayload {
  sub: string;
  type?: string;
  jti?: string;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  private accessSecret = process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret';
  private refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret';
  private accessTtl = process.env.JWT_ACCESS_TTL ?? '15m';
  private refreshTtl = process.env.JWT_REFRESH_TTL ?? '30d';

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const { hash, salt } = this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        passwordSalt: salt
      }
    });
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!this.verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.signAccessToken(user.id);
    const refreshToken = this.signRefreshToken(user.id);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: this.getExpiryDate(this.refreshTtl)
      }
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    const userId = payload.sub;

    const isBlacklisted = await this.isRefreshTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!tokenRecord || tokenRecord.revokedAt) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      await this.prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revokedAt: new Date() }
      });
      await this.blacklistRefreshToken(refreshToken, payload.exp);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() }
    });

    await this.blacklistRefreshToken(refreshToken, payload.exp);

    const accessToken = this.signAccessToken(userId);
    const newRefresh = this.signRefreshToken(userId);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: newRefresh,
        expiresAt: this.getExpiryDate(this.refreshTtl)
      }
    });

    return { accessToken, refreshToken: newRefresh };
  }

  async logout(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    const userId = payload.sub;

    await this.prisma.refreshToken.updateMany({
      where: { userId, token: refreshToken },
      data: { revokedAt: new Date() }
    });

    await this.blacklistRefreshToken(refreshToken, payload.exp);

    return { loggedOut: true };
  }

  verifyAccessToken(token: string) {
    const payload = jwt.verify(token, this.accessSecret) as JwtPayload;
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }
    return payload;
  }

  private verifyRefreshToken(token: string) {
    const payload = jwt.verify(token, this.refreshSecret) as JwtPayload;
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }

  private signAccessToken(userId: string) {
    return jwt.sign({ sub: userId, type: 'access' }, this.accessSecret, {
      expiresIn: this.accessTtl
    });
  }

  private signRefreshToken(userId: string) {
    const jti = crypto.randomBytes(16).toString('hex');
    return jwt.sign({ sub: userId, type: 'refresh', jti }, this.refreshSecret, {
      expiresIn: this.refreshTtl
    });
  }

  private hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  private verifyPassword(password: string, salt: string, hash: string) {
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  }

  private getExpiryDate(ttl: string) {
    const now = new Date();
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
    };
    return new Date(now.getTime() + value * multipliers[unit]);
  }

  private tokenHash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async isRefreshTokenBlacklisted(token: string) {
    const key = `auth:refresh:blacklist:${this.tokenHash(token)}`;
    const value = await this.redis.get(key);
    return value === '1';
  }

  private async blacklistRefreshToken(token: string, exp?: number) {
    const key = `auth:refresh:blacklist:${this.tokenHash(token)}`;
    const ttlSeconds = exp ? Math.max(1, exp - Math.floor(Date.now() / 1000)) : 60 * 60 * 24 * 30;
    await this.redis.set(key, '1', ttlSeconds);
  }
}


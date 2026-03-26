import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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

interface RegisterMetadata {
  firstName?: string;
  lastName?: string;
  preferredCommunicationStyle?: string;
}

@Injectable()
export class AuthService {
  private static readonly PHONE_OTP_TTL_SECONDS = 10 * 60;
  private static readonly PHONE_OTP_MAX_ATTEMPTS = 5;
  private static readonly PHONE_OTP_RESEND_WINDOW_SECONDS = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  private accessSecret = process.env['JWT_ACCESS_SECRET'] ?? 'dev_access_secret';
  private refreshSecret = process.env['JWT_REFRESH_SECRET'] ?? 'dev_refresh_secret';
  private accessTtl = process.env['JWT_ACCESS_TTL'] ?? '15m';
  private refreshTtl = process.env['JWT_REFRESH_TTL'] ?? '30d';

  async register(email: string, password: string, _metadata?: RegisterMetadata) {
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

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    if (!this.verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      phoneVerifiedAt: user.phoneVerifiedAt
    };
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

  async requestPhoneVerificationOtp(userId: string, phoneNumber: string) {
    const normalizedPhoneNumber = this.normalizePhoneNumber(phoneNumber);
    const resendKey = this.phoneOtpResendKey(userId);
    const resendTtl = await this.redis.ttl(resendKey);

    if (resendTtl > 0) {
      throw new HttpException(
        `Please wait ${resendTtl}s before requesting another OTP`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        phoneNumber: normalizedPhoneNumber,
        NOT: { id: userId }
      },
      select: { id: true }
    });

    if (existingUser) {
      throw new BadRequestException('Phone number is already used by another account');
    }

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);

    await this.redis.set(
      this.phoneOtpKey(userId),
      JSON.stringify({
        phoneNumber: normalizedPhoneNumber,
        otpHash,
        attempts: 0,
        requestedAt: new Date().toISOString()
      }),
      AuthService.PHONE_OTP_TTL_SECONDS
    );
    await this.redis.set(
      resendKey,
      '1',
      AuthService.PHONE_OTP_RESEND_WINDOW_SECONDS
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber: normalizedPhoneNumber,
        phoneVerifiedAt: null
      }
    });

    return {
      phoneNumber: normalizedPhoneNumber,
      expiresInSeconds: AuthService.PHONE_OTP_TTL_SECONDS,
      resendAvailableInSeconds: AuthService.PHONE_OTP_RESEND_WINDOW_SECONDS,
      ...(process.env['NODE_ENV'] !== 'production' ? { otp } : {})
    };
  }

  async verifyPhoneOtp(userId: string, phoneNumber: string, otp: string) {
    const normalizedPhoneNumber = this.normalizePhoneNumber(phoneNumber);
    const sanitizedOtp = this.normalizeOtp(otp);
    const otpKey = this.phoneOtpKey(userId);
    const payload = await this.redis.get(otpKey);

    if (!payload) {
      throw new BadRequestException('OTP expired or not requested');
    }

    const otpRecord = JSON.parse(payload) as {
      phoneNumber: string;
      otpHash: string;
      attempts: number;
      requestedAt: string;
    };

    if (otpRecord.phoneNumber !== normalizedPhoneNumber) {
      throw new BadRequestException('OTP does not match this phone number');
    }

    if (otpRecord.attempts >= AuthService.PHONE_OTP_MAX_ATTEMPTS) {
      await this.redis.del(otpKey);
      throw new HttpException('Maximum OTP attempts reached', HttpStatus.TOO_MANY_REQUESTS);
    }

    const ttlSeconds = await this.redis.ttl(otpKey);
    const nextAttempts = otpRecord.attempts + 1;
    const isValid = this.verifyOtpHash(sanitizedOtp, otpRecord.otpHash);

    if (!isValid) {
      await this.redis.set(
        otpKey,
        JSON.stringify({
          ...otpRecord,
          attempts: nextAttempts
        }),
        ttlSeconds > 0 ? ttlSeconds : undefined
      );

      throw new BadRequestException('Invalid OTP code');
    }

    await this.redis.del(otpKey);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber: normalizedPhoneNumber,
        phoneVerifiedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        phoneVerifiedAt: true
      }
    });

    return {
      verified: true,
      user
    };
  }

  verifyAccessToken(token: string) {
    const payload = jwt.verify(token, this.accessSecret) as JwtPayload;
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }
    return payload;
  }

  verifyRefreshTokenForStrategy(token: string) {
    return this.verifyRefreshToken(token);
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
      expiresIn: this.ttlToSeconds(this.accessTtl)
    });
  }

  private signRefreshToken(userId: string) {
    const jti = crypto.randomBytes(16).toString('hex');
    return jwt.sign({ sub: userId, type: 'refresh', jti }, this.refreshSecret, {
      expiresIn: this.ttlToSeconds(this.refreshTtl)
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
    return new Date(now.getTime() + this.ttlToSeconds(ttl) * 1000);
  }

  private ttlToSeconds(ttl: string) {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 30 * 24 * 60 * 60;
    }

    const value = Number(match[1]);
    const unit = match[2] ?? 'd';
    const multipliers: Record<'s' | 'm' | 'h' | 'd', number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60
    };

    if (!['s', 'm', 'h', 'd'].includes(unit)) {
      return 30 * 24 * 60 * 60;
    }

    return value * multipliers[unit as keyof typeof multipliers];
  }

  private tokenHash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateOtp() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  private normalizePhoneNumber(phoneNumber: string) {
    const normalized = phoneNumber.replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
      throw new BadRequestException('Phone number must use E.164 format');
    }
    return normalized;
  }

  private normalizeOtp(otp: string) {
    const normalized = otp.trim();
    if (!/^\d{6}$/.test(normalized)) {
      throw new BadRequestException('OTP must be a 6-digit code');
    }
    return normalized;
  }

  private hashOtp(otp: string) {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  private verifyOtpHash(otp: string, hash: string) {
    const otpHash = this.hashOtp(otp);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(otpHash, 'hex'));
  }

  private phoneOtpKey(userId: string) {
    return `auth:phone:otp:${userId}`;
  }

  private phoneOtpResendKey(userId: string) {
    return `auth:phone:otp:resend:${userId}`;
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


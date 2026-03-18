import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret';
const refreshTtl = process.env.JWT_REFRESH_TTL ?? '30d';

const users = [
  { email: 'seed@murmura.local', password: 'murmura_dev' },
  { email: 'alice@murmura.local', password: 'alice_dev' },
  { email: 'bob@murmura.local', password: 'bob_dev' }
];

function hashPassword(raw: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(raw, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function signRefreshToken(userId: string) {
  const jti = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ sub: userId, type: 'refresh', jti }, refreshSecret, { expiresIn: refreshTtl });
}

function getExpiryDate(ttl: string) {
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

async function main() {
  for (const userInput of users) {
    const existing = await prisma.user.findUnique({ where: { email: userInput.email } });
    if (existing) {
      console.log('Seed user already exists:', userInput.email);
      continue;
    }

    const { hash, salt } = hashPassword(userInput.password);
    const user = await prisma.user.create({
      data: {
        email: userInput.email,
        passwordHash: hash,
        passwordSalt: salt
      }
    });

    const refreshToken = signRefreshToken(user.id);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getExpiryDate(refreshTtl)
      }
    });

    console.log('Seed user created:', userInput.email);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { DatabaseModule } from '../../infrastructure/database/database.module.js';
import { RedisModule } from '../../infrastructure/redis/redis.module.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { WsJwtGuard } from './guards/ws-jwt.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy, WsJwtGuard, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, WsJwtGuard]
})
export class AuthModule {}


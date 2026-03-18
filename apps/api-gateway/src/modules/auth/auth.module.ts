import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { DatabaseModule } from '../../infrastructure/database/database.module.js';
import { RedisModule } from '../../infrastructure/redis/redis.module.js';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}


import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CognitiveModule } from './modules/cognitive/cognitive.module.js';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module.js';
import { SlashCommandsModule } from './modules/slash-commands/slash-commands.module.js';
import { InternalMessagingModule } from './modules/internal-messaging/internal-messaging.module.js';
import { WebsocketModule } from './modules/websocket/websocket.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RateLimitGuard } from './common/guards/rate-limit.guard.js';
import { RedisModule } from './infrastructure/redis/redis.module.js';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    CognitiveModule,
    DigitalTwinModule,
    SlashCommandsModule,
    InternalMessagingModule,
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard
    }
  ]
})
export class AppModule {}


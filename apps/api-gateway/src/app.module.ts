import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CognitiveModule } from './modules/cognitive/cognitive.module.js';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module.js';
import { SlashCommandsModule } from './modules/slash-commands/slash-commands.module.js';
import { InternalMessagingModule } from './modules/internal-messaging/internal-messaging.module.js';
import { MessagingModule } from './modules/messaging/messaging.module.js';
import { ChannelsModule } from './modules/channels/channels.module.js';
import { OpenClawModule } from './modules/openclaw/openclaw.module.js';
import { WebsocketModule } from './modules/websocket/websocket.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RateLimitGuard } from './common/guards/rate-limit.guard.js';
import { RedisModule } from './infrastructure/redis/redis.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { ConfigurationModule } from './infrastructure/config/config.module.js';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    CognitiveModule,
    MessagingModule,
    ChannelsModule,
    OpenClawModule,
    DigitalTwinModule,
    SlashCommandsModule,
    InternalMessagingModule,
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [
    JwtAuthGuard,
    RateLimitGuard,
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useExisting: RateLimitGuard
    }
  ]
})
export class AppModule {}


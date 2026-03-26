import { Module } from '@nestjs/common';
import { CognitiveModule } from '../cognitive/cognitive.module.js';
import { MessagingModule } from '../messaging/messaging.module.js';
import { OpenClawModule } from '../openclaw/openclaw.module.js';
import { AnalyseHandler } from './handlers/analyse.handler.js';
import { BrouillonHandler } from './handlers/brouillon.handler.js';
import { ReformuleHandler } from './handlers/reformule.handler.js';
import { ResumeHandler } from './handlers/resume.handler.js';
import { ToneHandler } from './handlers/tone.handler.js';
import { TraduitHandler } from './handlers/traduit.handler.js';
import { SlashCommandsController } from './slash-commands.controller.js';
import { SlashCommandsService } from './slash-commands.service.js';

@Module({
  imports: [CognitiveModule, MessagingModule, OpenClawModule],
  controllers: [SlashCommandsController],
  providers: [
    SlashCommandsService,
    ReformuleHandler,
    AnalyseHandler,
    ToneHandler,
    ResumeHandler,
    TraduitHandler,
    BrouillonHandler
  ]
})
export class SlashCommandsModule {}


import { Module } from '@nestjs/common';
import { SlashCommandsController } from './slash-commands.controller.js';
import { SlashCommandsService } from './slash-commands.service.js';

@Module({
  controllers: [SlashCommandsController],
  providers: [SlashCommandsService]
})
export class SlashCommandsModule {}


import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import {
  CurrentUser,
  type AuthenticatedUser
} from '../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { SlashCommandsService } from './slash-commands.service.js';

const ExecuteSlashCommandSchema = z.object({
  command: z.string().min(1),
  inputText: z.string().default(''),
  context: z
    .object({
      incomingMessage: z.string().min(1).optional(),
      threadId: z.string().min(1).optional(),
      tone: z.string().min(1).optional(),
      targetLanguage: z.string().min(2).optional()
    })
    .optional()
});

const SuggestionQuerySchema = z.object({
  threadId: z.string().min(1).optional()
});

@Controller('v1/slash-commands')
export class SlashCommandsController {
  constructor(private readonly slashCommandsService: SlashCommandsService) {}

  @Post('execute')
  @UsePipes(new ZodValidationPipe(ExecuteSlashCommandSchema))
  execute(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: z.infer<typeof ExecuteSlashCommandSchema>
  ) {
    return this.slashCommandsService.execute(
      body.command,
      body.inputText,
      user.userId,
      body.context
    );
  }

  @Get('suggestions')
  @UsePipes(new ZodValidationPipe(SuggestionQuerySchema))
  suggestions(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: z.infer<typeof SuggestionQuerySchema>
  ) {
    return this.slashCommandsService.getSuggestions(query.threadId, user.userId);
  }
}


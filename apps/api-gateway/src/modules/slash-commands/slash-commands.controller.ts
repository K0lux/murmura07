import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { z } from 'zod';
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
  execute(
    @Req() req: { user?: { userId: string } },
    @Body(new ZodValidationPipe(ExecuteSlashCommandSchema))
    body: z.infer<typeof ExecuteSlashCommandSchema>
  ) {
    return this.slashCommandsService.execute(
      body.command,
      body.inputText,
      req.user?.userId ?? 'anonymous',
      body.context
    );
  }

  @Get('suggestions')
  suggestions(
    @Req() req: { user?: { userId: string } },
    @Query(new ZodValidationPipe(SuggestionQuerySchema))
    query: z.infer<typeof SuggestionQuerySchema>
  ) {
    return this.slashCommandsService.getSuggestions(query.threadId, req.user?.userId ?? 'anonymous');
  }
}

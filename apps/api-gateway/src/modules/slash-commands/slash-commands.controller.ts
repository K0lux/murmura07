import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('v1/slash-commands')
export class SlashCommandsController {
  @Post('execute')
  execute(@Body() body: { command: string; inputText: string }) {
    return { result: body.inputText, capabilityUsed: 'cognitive', executionTimeMs: 0 };
  }

  @Get('suggestions')
  suggestions(@Query('threadId') threadId?: string) {
    return { threadId, suggestions: ['/reformule', '/analyse', '/tone'] };
  }
}

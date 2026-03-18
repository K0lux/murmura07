import { Controller, Get, Param, Req } from '@nestjs/common';
import { CognitiveService } from '../cognitive.service.js';

@Controller('v1/context')
export class ContextController {
  constructor(private readonly cognitiveService: CognitiveService) {}

  @Get(':threadId')
  async get(@Req() req: { headers: Record<string, string> }, @Param('threadId') threadId: string) {
    const userId = req.headers['x-user-id'] ?? 'anonymous';
    return this.cognitiveService.getContext(userId, threadId);
  }
}


import { Controller, Get, Query, Req, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { CognitiveService } from '../cognitive.service.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

const MemorySearchSchema = z.object({
  query: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  sources: z.string().optional()
});

const MemoryGetSchema = z.object({
  path: z.string().min(1),
  startLine: z.coerce.number().int().min(1).optional(),
  numLines: z.coerce.number().int().min(1).max(200).optional()
});

@Controller('v1/memory')
export class MemoryController {
  constructor(private readonly cognitiveService: CognitiveService) {}

  @Get('search')
  @UsePipes(new ZodValidationPipe(MemorySearchSchema))
  async search(
    @Query() query: z.infer<typeof MemorySearchSchema>,
    @Req() req: { user?: { userId: string } }
  ) {
    const userId = req.user?.userId ?? 'anonymous';
    const sources = query.sources ? query.sources.split(',').map((s) => s.trim()) : undefined;
    return this.cognitiveService.searchMemory(userId, query.query, {
      limit: query.limit,
      sources
    });
  }

  @Get('get')
  @UsePipes(new ZodValidationPipe(MemoryGetSchema))
  async get(
    @Query() query: z.infer<typeof MemoryGetSchema>,
    @Req() req: { user?: { userId: string } }
  ) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.getMemoryFile(userId, query.path, query.startLine, query.numLines);
  }
}


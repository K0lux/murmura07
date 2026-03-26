import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import type { RawMessage } from '@murmura/cognitive-core-shared';
import { CognitiveService } from '../cognitive.service.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

const AnalyzeRequestSchema = z.object({
  content: z.string().min(1),
  canal: z.string().min(1),
  interlocuteurId: z.string().min(1),
  threadId: z.string().optional(),
  urgencyFlag: z.boolean().optional()
});

@Controller('v1/analyze')
export class AnalyzeController {
  constructor(private readonly cognitiveService: CognitiveService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(AnalyzeRequestSchema))
  async analyze(
    @Body() body: z.infer<typeof AnalyzeRequestSchema>,
    @Req() req: { headers: Record<string, string>; user?: { userId: string } }
  ) {
    const requestId = req.headers['x-request-id'] ?? `req_${Date.now()}`;
    const userId = req.user?.userId ?? 'anonymous';
    const canal = body.canal as RawMessage['canal'];

    return this.cognitiveService.analyze(requestId, {
      userId,
      canal,
      interlocuteurId: body.interlocuteurId,
      content: body.content,
      metadata: {
        timestamp: new Date(),
        threadId: body.threadId,
        urgencyFlag: body.urgencyFlag ?? false,
        attachments: []
      }
    });
  }
}


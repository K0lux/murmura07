import { Body, Controller, Get, Patch, Req, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import type { IdentityModel } from '@murmura/cognitive-core-shared';
import { CognitiveService } from '../cognitive.service.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

const UpdateIdentitySchema = z.object({
  communicationStyle: z
    .object({
      formality: z.enum(['low', 'medium', 'high']).optional(),
      tone: z.enum(['direct', 'diplomatic', 'warm', 'neutral']).optional()
    })
    .optional(),
  confrontationLevel: z.number().min(0).max(1).optional(),
  riskTolerance: z.number().min(0).max(1).optional(),
  coreValues: z.array(z.string().min(1)).optional()
});

@Controller('v1/identity')
export class IdentityController {
  constructor(private readonly cognitiveService: CognitiveService) {}

  @Get()
  async get(@Req() req: { user?: { userId: string } }) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.getIdentity(userId);
  }

  @Patch()
  @UsePipes(new ZodValidationPipe(UpdateIdentitySchema))
  async update(
    @Req() req: { user?: { userId: string } },
    @Body() body: z.infer<typeof UpdateIdentitySchema>
  ) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.updateIdentity(userId, body as unknown as Partial<IdentityModel>);
  }
}


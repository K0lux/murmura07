import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { CognitiveService } from '../cognitive.service.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

const CreateRuleSchema = z.object({
  description: z.string().min(1)
});

@Controller('v1/governance')
export class GovernanceController {
  constructor(private readonly cognitiveService: CognitiveService) {}

  @Get('rules')
  async list(@Req() req: { user?: { userId: string } }) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.getGovernanceRules(userId);
  }

  @Post('rules')
  @UsePipes(new ZodValidationPipe(CreateRuleSchema))
  async create(
    @Req() req: { user?: { userId: string } },
    @Body() body: z.infer<typeof CreateRuleSchema>
  ) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.createGovernanceRule(userId, body.description);
  }
}


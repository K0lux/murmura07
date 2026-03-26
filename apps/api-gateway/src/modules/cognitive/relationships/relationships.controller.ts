import { Body, Controller, Get, Param, Patch, Query, Req, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { CognitiveService } from '../cognitive.service.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

const RelationshipQuerySchema = z.object({
  type: z.string().optional(),
  sort: z.string().optional()
});

const UpdateNotesSchema = z.object({
  notes: z.string().min(1)
});

@Controller('v1/relationships')
export class RelationshipsController {
  constructor(private readonly cognitiveService: CognitiveService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(RelationshipQuerySchema))
  async list(
    @Req() req: { user?: { userId: string } },
    @Query() query: z.infer<typeof RelationshipQuerySchema>
  ) {
    const userId = req.user?.userId ?? 'anonymous';
    const filters: { type?: string; sort?: string } = {};
    if (query.type !== undefined) {
      filters.type = query.type;
    }
    if (query.sort !== undefined) {
      filters.sort = query.sort;
    }
    return this.cognitiveService.getRelationships(userId, filters);
  }

  @Get(':interlocuteurId')
  async detail(@Req() req: { user?: { userId: string } }, @Param('interlocuteurId') id: string) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.getRelationshipDetail(userId, id);
  }

  @Patch(':id/notes')
  @UsePipes(new ZodValidationPipe(UpdateNotesSchema))
  async updateNotes(
    @Req() req: { user?: { userId: string } },
    @Param('id') id: string,
    @Body() body: z.infer<typeof UpdateNotesSchema>
  ) {
    const userId = req.user?.userId ?? 'anonymous';
    return this.cognitiveService.updateRelationshipNotes(userId, id, body.notes);
  }
}


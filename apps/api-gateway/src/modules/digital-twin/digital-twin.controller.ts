import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { DigitalTwinService } from './digital-twin.service.js';
import { CreateTwinSessionDto } from './dto/create-twin-session.dto.js';
import { TwinMessageDto } from './dto/twin-message.dto.js';

@Controller('v1/twin')
export class DigitalTwinController {
  constructor(private readonly digitalTwinService: DigitalTwinService) {}

  @Post('session')
  createSession(
    @Req() req: { user?: { userId: string } },
    @Body() body: CreateTwinSessionDto
  ) {
    return this.digitalTwinService.createSession(req.user?.userId ?? 'anonymous', body.contactId);
  }

  @Post('message')
  sendMessage(@Req() req: { user?: { userId: string } }, @Body() body: TwinMessageDto) {
    return this.digitalTwinService.sendMessage(
      req.user?.userId ?? 'anonymous',
      body.sessionId,
      body.content
    );
  }

  @Get('stream/:sessionId')
  stream(@Param('sessionId') sessionId: string) {
    return this.digitalTwinService.openStream(sessionId);
  }

  @Get('context/:contactId')
  getContext(@Req() req: { user?: { userId: string } }, @Param('contactId') contactId: string) {
    return this.digitalTwinService.getRelationshipContext(req.user?.userId ?? 'anonymous', contactId);
  }

  @Delete('session/:sessionId')
  close(@Req() req: { user?: { userId: string } }, @Param('sessionId') sessionId: string) {
    return this.digitalTwinService.closeSession(req.user?.userId ?? 'anonymous', sessionId);
  }
}

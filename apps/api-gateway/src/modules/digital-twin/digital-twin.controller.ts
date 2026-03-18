import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('v1/twin')
export class DigitalTwinController {
  @Post('session')
  createSession(@Body() body: { contactId: string }) {
    return { sessionId: 'stub', relationshipContext: {} };
  }

  @Post('message')
  sendMessage(@Body() body: { sessionId: string; content: string }) {
    return { streamUrl: `/v1/twin/stream/${body.sessionId}` };
  }

  @Get('stream/:sessionId')
  stream(@Param('sessionId') sessionId: string) {
    return { sessionId };
  }

  @Get('context/:contactId')
  getContext(@Param('contactId') contactId: string) {
    return { contactId, summary: {} };
  }

  @Delete('session/:sessionId')
  close(@Param('sessionId') sessionId: string) {
    return { sessionId, closed: true };
  }
}

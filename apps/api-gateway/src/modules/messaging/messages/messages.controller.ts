import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { MessagesService } from './messages.service.js';
import { SendMessageDto } from '../dto/send-message.dto.js';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('threads/:threadId/messages')
  list(
    @Req() req: { user?: { userId: string } },
    @Param('threadId') threadId: string,
    @Query('limit') limit?: string
  ) {
    return this.messagesService.listMessages(
      req.user?.userId ?? 'anonymous',
      threadId,
      limit ? Number(limit) : undefined
    );
  }

  @Post('threads/:threadId/messages')
  send(
    @Req() req: { user?: { userId: string } },
    @Param('threadId') threadId: string,
    @Body() body: SendMessageDto
  ) {
    return this.messagesService.sendMessage(req.user?.userId ?? 'anonymous', threadId, body);
  }

  @Patch('messages/:id/read')
  markRead(@Req() req: { user?: { userId: string } }, @Param('id') id: string) {
    return this.messagesService.markRead(req.user?.userId ?? 'anonymous', id);
  }
}

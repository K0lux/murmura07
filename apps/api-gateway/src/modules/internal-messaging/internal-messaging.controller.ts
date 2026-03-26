import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InternalMessagingService } from './internal-messaging.service.js';
import { CreateInternalThreadDto } from './dto/create-internal-thread.dto.js';
import { SendInternalMessageDto } from './dto/send-internal-message.dto.js';
import { MessageReactionDto } from './dto/message-reaction.dto.js';

@Controller('v1/internal')
export class InternalMessagingController {
  constructor(private readonly internalMessagingService: InternalMessagingService) {}

  @Get('threads')
  listThreads() {
    return this.internalMessagingService.listThreads();
  }

  @Post('threads')
  createThread(@Body() body: CreateInternalThreadDto) {
    return this.internalMessagingService.createThread(body.targetUserId);
  }

  @Get('threads/:threadId/messages')
  listMessages(@Param('threadId') threadId: string) {
    return this.internalMessagingService.listMessages(threadId);
  }

  @Post('threads/:threadId/messages')
  sendMessage(@Param('threadId') threadId: string, @Body() body: SendInternalMessageDto) {
    return this.internalMessagingService.sendMessage(threadId, body);
  }

  @Post('messages/:messageId/reactions')
  react(@Param('messageId') messageId: string, @Body() body: MessageReactionDto) {
    return this.internalMessagingService.react(messageId, body.emoji);
  }

  @Get('users/search')
  search(@Query('query') query: string) {
    return this.internalMessagingService.searchUsers(query);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('v1/internal')
export class InternalMessagingController {
  @Get('threads')
  listThreads() {
    return { threads: [] };
  }

  @Post('threads')
  createThread(@Body() body: { targetUserId: string }) {
    return { threadId: 'stub', targetUserId: body.targetUserId };
  }

  @Get('threads/:threadId/messages')
  listMessages(@Param('threadId') threadId: string) {
    return { threadId, messages: [] };
  }

  @Post('threads/:threadId/messages')
  sendMessage(@Param('threadId') threadId: string, @Body() body: { content: string }) {
    return { threadId, messageId: 'stub' };
  }

  @Post('messages/:messageId/reactions')
  react(@Param('messageId') messageId: string, @Body() body: { emoji: string }) {
    return { messageId, emoji: body.emoji };
  }

  @Get('users/search')
  search(@Query('query') query: string) {
    return { query, users: [] };
  }
}

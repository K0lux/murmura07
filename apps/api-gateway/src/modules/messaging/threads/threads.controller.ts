import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from '../dto/create-thread.dto.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  list(@Req() req: { user?: { userId: string } }) {
    return this.threadsService.listThreads(req.user?.userId ?? 'anonymous');
  }

  @Post()
  create(@Req() req: { user?: { userId: string } }, @Body() body: CreateThreadDto) {
    return this.threadsService.createThread(req.user?.userId ?? 'anonymous', body);
  }

  @Get(':id')
  detail(@Req() req: { user?: { userId: string } }, @Param('id') id: string) {
    return this.threadsService.getThread(id, req.user?.userId ?? 'anonymous');
  }

  @Patch(':id')
  update(
    @Req() req: { user?: { userId: string } },
    @Param('id') id: string,
    @Body() body: { archived?: boolean; pinned?: boolean }
  ) {
    return this.threadsService.updateThread(id, req.user?.userId ?? 'anonymous', body);
  }

  @Delete(':id')
  remove(@Req() req: { user?: { userId: string } }, @Param('id') id: string) {
    return this.threadsService.deleteThread(id, req.user?.userId ?? 'anonymous');
  }
}

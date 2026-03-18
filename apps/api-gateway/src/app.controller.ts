import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { name: 'Murmura API Gateway', status: 'ok' };
  }

  @Get('health')
  getHealth() {
    return { status: 'healthy' };
  }
}

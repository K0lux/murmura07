import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EmailPoller implements OnModuleInit {
  private readonly logger = new Logger(EmailPoller.name);

  onModuleInit() {
    this.logger.debug('Email poller initialized');
  }
}

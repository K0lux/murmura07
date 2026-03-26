import { Global, Module } from '@nestjs/common';
import { getExecutionLayerConfig, type ExecutionLayerConfig } from './openclaw.configuration.js';

export const OPENCLAW_CONFIG = Symbol('OPENCLAW_CONFIG');

@Global()
@Module({
  providers: [
    {
      provide: OPENCLAW_CONFIG,
      useFactory: (): ExecutionLayerConfig => getExecutionLayerConfig()
    }
  ],
  exports: [OPENCLAW_CONFIG]
})
export class OpenClawConfigModule {}

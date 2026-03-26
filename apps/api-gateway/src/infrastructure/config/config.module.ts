import { Global, Module } from '@nestjs/common';
import { getConfiguration, type MurmuraConfiguration } from './configuration.js';

export const MURMURA_CONFIG = Symbol('MURMURA_CONFIG');

@Global()
@Module({
  providers: [
    {
      provide: MURMURA_CONFIG,
      useFactory: (): MurmuraConfiguration => getConfiguration()
    }
  ],
  exports: [MURMURA_CONFIG]
})
export class ConfigurationModule {}

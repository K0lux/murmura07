import { Injectable } from '@nestjs/common';
import { CognitiveService } from '../cognitive/cognitive.service.js';
import { OpenClawService } from '../openclaw/openclaw.service.js';

@Injectable()
export class DigitalTwinOrchestrator {
  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly openClawService: OpenClawService
  ) {}

  async searchMemory(userId: string, query: string) {
    const result = await this.cognitiveService.searchMemory(userId, query, { limit: 5 });
    return {
      count: result.length,
      result
    };
  }

  async searchWeb(query: string) {
    return this.openClawService.executeAction('search_web', { query });
  }
}

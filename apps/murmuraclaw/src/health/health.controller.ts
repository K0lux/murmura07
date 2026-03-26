import { Controller, Get, Param } from '@nestjs/common';
import { OpenClawClientService } from '../modules/client/openclaw-client.service.js';

@Controller()
export class HealthController {
  constructor(private readonly client: OpenClawClientService) {}

  @Get('health')
  async getHealth() {
    return this.client.healthSnapshot();
  }

  @Get('agents')
  listAgents() {
    return {
      agents: this.client.listAgents()
    };
  }

  @Get('agents/:agentId/status')
  getAgentStatus(@Param('agentId') agentId: string) {
    return this.client.getAgentStatus(agentId);
  }
}

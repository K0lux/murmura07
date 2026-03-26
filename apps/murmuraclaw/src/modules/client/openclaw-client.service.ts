import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { Inject, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { OPENCLAW_CONFIG } from '../../config/openclaw-config.module.js';
import {
  type AgentStatus,
  type ExecutionLayerConfig,
  type RegisteredAgent
} from '../../config/openclaw.configuration.js';

export interface QueryResult {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  response: string;
  sandboxProfile: RegisteredAgent['sandboxProfile'];
  remote: boolean;
}

@Injectable()
export class OpenClawClientService {
  private readonly logger = new Logger(OpenClawClientService.name);

  constructor(@Inject(OPENCLAW_CONFIG) private readonly config: ExecutionLayerConfig) {}

  listAgents() {
    return this.config.agents;
  }

  getAgentStatus(agentId?: string) {
    if (!agentId) {
      return {
        agents: this.config.agents,
        remoteConnected: Boolean(this.config.remote.baseUrl)
      };
    }

    const agent = this.findAgent(agentId);
    return {
      ...agent,
      remoteConnected: Boolean(this.config.remote.baseUrl)
    };
  }

  async query(agentId: string, message: string): Promise<QueryResult> {
    const agent = this.findAgent(agentId);

    if (this.config.remote.baseUrl) {
      try {
        const payload = await this.requestRemote('/query', {
          method: 'POST',
          body: JSON.stringify({ agentId, message })
        });

        return {
          agentId,
          agentName: agent.name,
          status: agent.status,
          response:
            typeof payload?.['response'] === 'string'
              ? payload['response']
              : `Remote query executed by ${agent.name}.`,
          sandboxProfile: agent.sandboxProfile,
          remote: true
        };
      } catch (error) {
        this.logger.warn(
          `Remote query failed for ${agentId}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return {
      agentId,
      agentName: agent.name,
      status: agent.status,
      response: [
        `${agent.name} accepted the task in ${agent.sandboxProfile} mode.`,
        `Prompt digest: ${message.slice(0, 160)}`,
        'Remote OpenClaw is unavailable, so the execution layer returned a local deterministic fallback.'
      ].join(' '),
      sandboxProfile: agent.sandboxProfile,
      remote: false
    };
  }

  async executeMemorySearch(userId: string, query: string, limit?: number) {
    const workspacePath = await this.ensureWorkspace(userId);
    const files = await this.collectMarkdownFiles(workspacePath);
    const normalizedQuery = query.trim().toLowerCase();
    const cappedLimit = Math.min(limit ?? this.config.sandbox.maxSearchResults, this.config.sandbox.maxSearchResults);
    const results: Array<Record<string, unknown>> = [];

    for (const filePath of files) {
      const content = await fs.readFile(filePath, 'utf8');
      const index = content.toLowerCase().indexOf(normalizedQuery);
      if (index === -1) {
        continue;
      }

      const start = Math.max(0, index - 120);
      const end = Math.min(content.length, index + normalizedQuery.length + 220);
      const relativePath = path.relative(workspacePath, filePath).replace(/\\/g, '/');
      results.push({
        source: relativePath,
        snippet: content.slice(start, end).replace(/\s+/g, ' ').trim(),
        score: 1
      });

      if (results.length >= cappedLimit) {
        break;
      }
    }

    return results;
  }

  async fetchTextFromUrl(targetUrl: string) {
    const url = this.ensureAllowedUrl(targetUrl);
    const response = await fetch(url, {
      headers: {
        'user-agent': 'murmura-murmuraclaw/1.0'
      },
      signal: AbortSignal.timeout(this.config.sandbox.maxActionTimeoutMs)
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(`Upstream URL returned ${response.status}`);
    }

    const raw = await response.text();
    const truncated = raw.slice(0, this.config.sandbox.maxFetchBytes);
    const contentType = response.headers.get('content-type') ?? 'text/plain';

    return {
      url,
      contentType,
      content: this.normalizeContent(truncated, contentType),
      truncated: raw.length > truncated.length,
      size: truncated.length
    };
  }

  async appendWorkspaceMarkdown(userId: string, relativePath: string, content: string) {
    const filePath = await this.resolveWorkspacePath(userId, relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.appendFile(filePath, content, 'utf8');
    return { filePath };
  }

  async healthSnapshot() {
    return {
      status: 'healthy',
      remoteConfigured: Boolean(this.config.remote.baseUrl),
      autonomyMode: this.config.sandbox.defaultAutonomyMode,
      sandbox: {
        allowedNetworkHosts: this.config.sandbox.allowedNetworkHosts,
        writablePaths: this.config.sandbox.writablePaths,
        maxActionTimeoutMs: this.config.sandbox.maxActionTimeoutMs,
        maxWorkflowTimeoutMs: this.config.sandbox.maxWorkflowTimeoutMs
      },
      agents: this.listAgents()
    };
  }

  isAutonomyAllowed(level: string | undefined) {
    const effectiveLevel = level ?? this.config.sandbox.defaultAutonomyMode;
    return effectiveLevel === 'supervised' || effectiveLevel === 'full';
  }

  ensureAllowedUrl(targetUrl: string) {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      throw new NotFoundException('Invalid URL');
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new NotFoundException('Only HTTP(S) URLs are allowed');
    }

    if (!this.config.sandbox.allowedNetworkHosts.includes(parsed.hostname)) {
      throw new NotFoundException(`Host ${parsed.hostname} is not allowed by sandbox policy`);
    }

    return parsed.toString();
  }

  private findAgent(agentId: string) {
    const agent = this.config.agents.find((item) => item.id === agentId);
    if (!agent) {
      throw new NotFoundException(`Unknown agent: ${agentId}`);
    }
    return agent;
  }

  private async requestRemote(endpoint: string, init: RequestInit) {
    if (!this.config.remote.baseUrl) {
      throw new ServiceUnavailableException('Remote OpenClaw base URL is not configured');
    }

    const response = await fetch(new URL(endpoint, this.config.remote.baseUrl).toString(), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(this.config.remote.apiKey ? { authorization: `Bearer ${this.config.remote.apiKey}` } : {}),
        ...(init.headers ?? {})
      },
      signal: AbortSignal.timeout(this.config.sandbox.maxActionTimeoutMs)
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(`Remote OpenClaw returned ${response.status}`);
    }

    return (await response.json()) as Record<string, unknown>;
  }

  private async resolveWorkspacePath(userId: string, relativePath: string) {
    const workspacePath = await this.ensureWorkspace(userId);
    const resolved = path.resolve(workspacePath, relativePath);
    const allowedRoot = path.resolve(workspacePath);

    if (!resolved.startsWith(allowedRoot)) {
      throw new NotFoundException('Resolved path escapes the sandbox workspace');
    }

    return resolved;
  }

  private normalizeContent(content: string, contentType: string) {
    if (contentType.includes('html')) {
      return content
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return content.replace(/\s+/g, ' ').trim();
  }

  private resolveWorkspace(userId: string) {
    const root =
      this.config.sandbox.workspaceRoot ??
      path.join(process.env['HOME'] ?? process.env['USERPROFILE'] ?? '.', '.murmura', 'workspace');
    return path.join(root, userId);
  }

  private async ensureWorkspace(userId: string) {
    const workspacePath = this.resolveWorkspace(userId);
    if (!existsSync(workspacePath)) {
      await fs.mkdir(path.join(workspacePath, 'memory'), { recursive: true });
      await fs.mkdir(path.join(workspacePath, 'relationships'), { recursive: true });
      await fs.writeFile(path.join(workspacePath, 'MEMORY.md'), '# Memory\n', { flag: 'wx' }).catch(() => undefined);
      await fs.writeFile(path.join(workspacePath, 'CONTEXT.md'), '# Context\n', { flag: 'wx' }).catch(() => undefined);
    }

    return workspacePath;
  }

  private async collectMarkdownFiles(rootDir: string): Promise<string[]> {
    const results: string[] = [];
    const walk = async (currentDir: string) => {
      let entries: Array<{ isDirectory(): boolean; isFile(): boolean; name: string }>;
      try {
        entries = (await fs.readdir(currentDir, { withFileTypes: true })) as Array<{
          isDirectory(): boolean;
          isFile(): boolean;
          name: string;
        }>;
      } catch {
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
          continue;
        }
        if (entry.isFile() && entry.name.endsWith('.md')) {
          results.push(fullPath);
        }
      }
    };

    await walk(rootDir);
    return results;
  }
}

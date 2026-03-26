export type AgentStatus = 'online' | 'degraded' | 'offline';
export type AutonomyMode = 'suggestion_only' | 'supervised' | 'full';

export interface RegisteredAgent {
  id: string;
  name: string;
  capabilities: string[];
  status: AgentStatus;
  sandboxProfile: 'strict' | 'research' | 'integration';
}

export interface ExecutionLayerConfig {
  app: {
    port: number;
    env: string;
  };
  gateway: {
    baseUrl: string | null;
    authToken: string | null;
  };
  remote: {
    baseUrl: string | null;
    apiKey: string | null;
  };
  sandbox: {
    workspaceRoot: string | undefined;
    scratchDir: string;
    allowedNetworkHosts: string[];
    maxActionTimeoutMs: number;
    maxWorkflowTimeoutMs: number;
    maxFetchBytes: number;
    maxSearchResults: number;
    defaultAutonomyMode: AutonomyMode;
    writablePaths: string[];
  };
  agents: RegisteredAgent[];
}

const parseCsv = (value: string | undefined, fallback: string[]) =>
  (value ?? fallback.join(','))
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const parseAgents = (): RegisteredAgent[] => [
  {
    id: 'planner',
    name: 'Planner',
    capabilities: ['query', 'workflow-routing'],
    status: 'online',
    sandboxProfile: 'strict'
  },
  {
    id: 'web-researcher',
    name: 'Web Researcher',
    capabilities: ['web-search', 'fetch-url', 'summarize'],
    status: 'online',
    sandboxProfile: 'research'
  },
  {
    id: 'memory-keeper',
    name: 'Memory Keeper',
    capabilities: ['memory-search', 'workspace-write'],
    status: 'online',
    sandboxProfile: 'integration'
  },
  {
    id: 'calendar-assistant',
    name: 'Calendar Assistant',
    capabilities: ['calendar-read', 'calendar-propose'],
    status: 'degraded',
    sandboxProfile: 'integration'
  }
];

export function getExecutionLayerConfig(): ExecutionLayerConfig {
  const workspaceRoot = process.env['MURMURA_WORKSPACE_DIR'];

  return {
    app: {
      port: Number(process.env['PORT'] ?? 3001),
      env: process.env['NODE_ENV'] ?? 'development'
    },
    gateway: {
      baseUrl: process.env['OPENCLAW_GATEWAY_BASE_URL'] ?? process.env['API_GATEWAY_BASE_URL'] ?? null,
      authToken: process.env['OPENCLAW_GATEWAY_TOKEN'] ?? null
    },
    remote: {
      baseUrl: process.env['OPENCLAW_REMOTE_BASE_URL'] ?? null,
      apiKey: process.env['OPENCLAW_REMOTE_API_KEY'] ?? null
    },
    sandbox: {
      workspaceRoot,
      scratchDir: process.env['OPENCLAW_SCRATCH_DIR'] ?? '/tmp/openclaw',
      allowedNetworkHosts: parseCsv(process.env['OPENCLAW_ALLOWED_HOSTS'], [
        'localhost',
        '127.0.0.1',
        'murmuraclaw',
        'api-gateway'
      ]),
      maxActionTimeoutMs: Number(process.env['OPENCLAW_ACTION_TIMEOUT_MS'] ?? 12000),
      maxWorkflowTimeoutMs: Number(process.env['OPENCLAW_WORKFLOW_TIMEOUT_MS'] ?? 30000),
      maxFetchBytes: Number(process.env['OPENCLAW_MAX_FETCH_BYTES'] ?? 75000),
      maxSearchResults: Number(process.env['OPENCLAW_MAX_SEARCH_RESULTS'] ?? 5),
      defaultAutonomyMode: (process.env['OPENCLAW_AUTONOMY_MODE'] as AutonomyMode | undefined) ?? 'suggestion_only',
      writablePaths: parseCsv(process.env['OPENCLAW_WRITABLE_PATHS'], [workspaceRoot ?? 'workspace-template'])
    },
    agents: parseAgents()
  };
}

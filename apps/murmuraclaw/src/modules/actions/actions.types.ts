export interface ActionExecutionRequest {
  actionType: string;
  params: Record<string, unknown>;
  userId: string;
  context?: Record<string, unknown>;
}

export interface ActionExecutionResult {
  status: 'completed' | 'requires_approval' | 'failed';
  summary: string;
  data?: Record<string, unknown>;
}

export interface ActionHandler {
  readonly actionType: string;
  execute(request: ActionExecutionRequest): Promise<ActionExecutionResult>;
}

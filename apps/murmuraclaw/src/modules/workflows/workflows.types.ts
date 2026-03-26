export interface WorkflowTriggerRequest {
  workflowId: string;
  context: Record<string, unknown>;
}

export interface WorkflowDefinition {
  readonly workflowId: string;
  execute(context: Record<string, unknown>): Promise<Record<string, unknown>>;
}

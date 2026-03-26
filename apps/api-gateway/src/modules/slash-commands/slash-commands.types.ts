export interface SlashCommandContextInput {
  incomingMessage?: string | undefined;
  threadId?: string | undefined;
  tone?: string | undefined;
  targetLanguage?: string | undefined;
}

export interface SlashCommandExecutionContext {
  userId: string;
  command: string;
  inputText: string;
  incomingMessage?: string | undefined;
  threadId?: string | undefined;
  tone?: string | undefined;
  targetLanguage?: string | undefined;
  interlocuteurId?: string | undefined;
}

export interface SlashCommandResult {
  result: string;
  capabilityUsed: string;
}

export interface SlashCommandHandler {
  readonly command: string;
  readonly aliases?: readonly string[];
  execute(context: SlashCommandExecutionContext): Promise<SlashCommandResult>;
}

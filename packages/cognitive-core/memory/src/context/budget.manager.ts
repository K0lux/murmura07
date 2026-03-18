export interface BudgetAllocation {
  source: string;
  tokens: number;
}

export class BudgetManager {
  constructor(private readonly maxTokens = 2000) {}

  allocate(sources: Array<{ source: string; content: string }>): BudgetAllocation[] {
    const perSource = Math.floor(this.maxTokens / Math.max(1, sources.length));
    return sources.map((source) => ({
      source: source.source,
      tokens: Math.min(perSource, this.estimateTokens(source.content))
    }));
  }

  estimateTokens(content: string): number {
    return Math.ceil(content.length / 4);
  }
}

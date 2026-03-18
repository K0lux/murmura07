import { BudgetManager } from './budget.manager.js';

export class ContextInjector {
  constructor(private readonly budgetManager = new BudgetManager()) {}

  buildPrompt(sources: Array<{ source: string; content: string }>) {
    const allocations = this.budgetManager.allocate(sources);
    return allocations.map((allocation) => {
      const content = sources.find((s) => s.source === allocation.source)?.content ?? '';
      return `# ${allocation.source}\n${content}`;
    });
  }
}


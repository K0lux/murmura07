export class SessionCompactor {
  compact(messages: string[]): { summary: string; removed: number } {
    if (messages.length <= 5) {
      return { summary: messages.join(' '), removed: 0 };
    }

    const removed = Math.floor(messages.length / 2);
    const summary = messages.slice(0, removed).join(' ').slice(0, 500);
    return { summary, removed };
  }
}

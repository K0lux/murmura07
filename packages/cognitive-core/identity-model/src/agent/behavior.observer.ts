export class BehaviorObserver {
  observe(userId: string, message: string) {
    const length = message.trim().length;
    const hasAggressivePunctuation = /!{2,}|\?{2,}/.test(message);
    const signal = hasAggressivePunctuation ? 'high_arousal' : length > 200 ? 'verbose' : 'neutral';

    return {
      userId,
      signal,
      length,
      sample: message.slice(0, 120)
    };
  }
}

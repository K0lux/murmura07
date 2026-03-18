export class ContextDetector {
  shouldSearchMemory(message: string): boolean {
    return message.length > 20;
  }
}

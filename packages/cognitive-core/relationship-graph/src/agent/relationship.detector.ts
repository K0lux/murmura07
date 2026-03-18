export class RelationshipDetector {
  detect(name: string) {
    const lower = name.toLowerCase();
    const type = lower.includes('boss') ? 'manager' : 'peer';
    return { name, type };
  }
}

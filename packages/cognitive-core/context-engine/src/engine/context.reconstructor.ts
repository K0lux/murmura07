export class ContextReconstructor {
  private dirty = false;

  markDirty() {
    this.dirty = true;
  }

  shouldReconstruct(): boolean {
    return this.dirty;
  }

  reset() {
    this.dirty = false;
  }
}

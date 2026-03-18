import { IdentityModel } from '@murmura/cognitive-core-shared';

export class IdentityStore {
  private current: IdentityModel | null = null;

  getCurrent() {
    return this.current;
  }

  save(model: IdentityModel) {
    this.current = model;
    return model;
  }
}

import { IdentityModel } from '@murmura/cognitive-core-shared';
import { ProfileBuilder } from './profile.builder.js';
import { BehaviorObserver } from './behavior.observer.js';
import { ProfileUpdater } from './profile.updater.js';
import { SoulWriter } from './soul.writer.js';

export class IdentityModelAgent {
  private builder = new ProfileBuilder();
  private observer = new BehaviorObserver();
  private updater = new ProfileUpdater();
  private writer = new SoulWriter();

  async buildInitial(userId: string): Promise<IdentityModel> {
    const model = this.builder.build(userId);
    await this.writer.write(userId, model);
    return model;
  }

  observe(userId: string, message: string) {
    return this.observer.observe(userId, message);
  }

  async update(userId: string, current: IdentityModel, delta: Partial<IdentityModel>) {
    const next = this.updater.apply(current, delta);
    await this.writer.write(userId, next);
    return next;
  }
}


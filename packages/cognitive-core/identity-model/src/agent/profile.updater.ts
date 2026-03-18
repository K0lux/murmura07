import { IdentityModel } from '@murmura/cognitive-core-shared';

export class ProfileUpdater {
  apply(current: IdentityModel, delta: Partial<IdentityModel>): IdentityModel {
    return {
      ...current,
      ...delta,
      communicationStyle: {
        ...current.communicationStyle,
        ...delta.communicationStyle
      },
      updatedAt: new Date(),
      version: (current.version ?? 1) + 1
    };
  }
}

import { Episode } from '@murmura/cognitive-core-shared';

export class EpisodicMemory {
  store(_episode: Episode) {
    return true;
  }

  retrieve() {
    return [] as Episode[];
  }
}

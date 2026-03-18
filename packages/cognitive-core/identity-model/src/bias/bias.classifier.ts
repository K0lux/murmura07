import { BiasType } from '@murmura/cognitive-core-shared';

export class BiasClassifier {
  classify(pattern: string): BiasType {
    if (pattern.includes('over_explains')) {
      return 'over_explains';
    }
    return 'underestimates_tension';
  }
}

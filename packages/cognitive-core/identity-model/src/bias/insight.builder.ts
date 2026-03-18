import { BiasType } from '@murmura/cognitive-core-shared';

export class InsightBuilder {
  build(type: BiasType) {
    const description =
      type === 'over_explains'
        ? 'Tendance à sur-expliquer dans les situations tendues.'
        : 'Tendance à sous-estimer la tension.';

    return {
      title: 'Insight',
      description
    };
  }
}

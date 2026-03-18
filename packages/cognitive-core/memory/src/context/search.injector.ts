import { MemorySearchResult } from '@murmura/cognitive-core-shared';

export class SearchInjector {
  inject(results: MemorySearchResult[]): string {
    if (!results.length) {
      return '';
    }

    return results
      .map((result) => `> ${result.snippet}\n(Source: ${result.source})`)
      .join('\n\n');
  }
}

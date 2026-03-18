import { EmbeddingProvider } from './provider.interface.js';

export class NullEmbeddingProvider implements EmbeddingProvider {
  name = 'null';
  modelName = 'null';
  dimensions = 0;

  isAvailable() {
    return true;
  }

  async embed(_text: string): Promise<number[]> {
    return [];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return texts.map(() => []);
  }
}


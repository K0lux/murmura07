import { EmbeddingProvider } from './provider.interface.js';

export class OpenAIProvider implements EmbeddingProvider {
  name = 'openai';
  modelName = 'text-embedding-3-large';
  dimensions = 1536;

  isAvailable() {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async embed(text: string) {
    return Array(this.dimensions).fill(0);
  }

  async embedBatch(texts: string[]) {
    return texts.map(() => Array(this.dimensions).fill(0));
  }
}


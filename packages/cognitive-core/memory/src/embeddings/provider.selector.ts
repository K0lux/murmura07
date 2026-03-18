import { EmbeddingProvider } from './provider.interface.js';
import { NullEmbeddingProvider } from './local.provider.js';

export function selectEmbeddingProvider(): EmbeddingProvider {
  return new NullEmbeddingProvider();
}


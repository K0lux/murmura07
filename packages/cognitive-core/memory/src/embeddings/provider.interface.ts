export interface EmbeddingProvider {
  name: string;
  modelName: string;
  dimensions: number;
  isAvailable(): boolean;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

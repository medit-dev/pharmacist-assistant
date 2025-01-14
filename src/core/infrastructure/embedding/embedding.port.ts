export abstract class EmbeddingPort<Model> {
  abstract embed(text: string): Promise<void> | void;
  abstract embedBatch(texts: Array<string>): Promise<void> | void;
  abstract get model(): Model;
}

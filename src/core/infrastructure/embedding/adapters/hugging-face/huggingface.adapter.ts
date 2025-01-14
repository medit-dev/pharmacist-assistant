import { Injectable } from '@nestjs/common';

import { EmbeddingPort } from 'src/core/infrastructure/embedding/embedding.port';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

@Injectable()
export class HuggingfaceAdapter extends EmbeddingPort<HuggingFaceInferenceEmbeddings> {
  private readonly _model: HuggingFaceInferenceEmbeddings;

  get model(): HuggingFaceInferenceEmbeddings {
    return this._model;
  }

  constructor(private readonly modelConfig: ModelConfig) {
    super();

    this._model = new HuggingFaceInferenceEmbeddings({
      apiKey: this.modelConfig.apiKey,
      model: this.modelConfig.name,
    });
  }

  async embed(text: string): Promise<void> {
    await this.embedBatch([text]);
  }
  async embedBatch(texts: Array<string>): Promise<void> {
    await Promise.all(texts.map((text) => this.embed(text)));
  }
}

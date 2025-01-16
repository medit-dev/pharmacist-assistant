import { Injectable } from '@nestjs/common';

import { EmbeddingPort } from 'src/core/infrastructure/embedding/embedding.port';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class OpenAIAdapter extends EmbeddingPort<OpenAIEmbeddings> {
  private readonly _model: OpenAIEmbeddings;

  get model(): OpenAIEmbeddings {
    return this._model;
  }

  constructor(private readonly modelConfig: ModelConfig) {
    super();

    this._model = new OpenAIEmbeddings({
      apiKey: this.modelConfig.apiKey,
      model: this.modelConfig.embedding,
    });
  }

  async embed(text: string): Promise<void> {
    await this.embedBatch([text]);
  }
  async embedBatch(texts: Array<string>): Promise<void> {
    await Promise.all(texts.map((text) => this.embed(text)));
  }
}

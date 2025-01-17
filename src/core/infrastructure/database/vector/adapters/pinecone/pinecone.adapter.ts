import { Injectable, Logger } from '@nestjs/common';
import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { PineconeConfig } from 'src/core/infrastructure/database/vector/adapters/pinecone/PineconeConfig';
import { Index, Pinecone } from '@pinecone-database/pinecone';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import {
  QuestionPatterns,
  SearchService,
} from 'src/modules/chat/corresponding/providers/search.service';
import { PineconeStore } from '@langchain/pinecone';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { ExtendedDocument } from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';

@Injectable()
export class PineconeAdapter<
  EmbeddingModel extends EmbeddingsInterface,
> extends VectorDatabasePort<Index, EmbeddingModel, PineconeStore> {
  private readonly logger = new Logger('PineconeAdapter');
  private readonly client: Pinecone;

  constructor(
    private readonly config: PineconeConfig,
    private readonly modelConfig: ModelConfig,
  ) {
    super();

    this.client = new Pinecone({ apiKey: config.apiKey });

    this.logger.log('Init Pinecone Connection');
  }

  async createIndex() {
    try {
      await this.client.createIndex({
        dimension: this.modelConfig.dimension,
        metric: 'cosine',
        name: this.config.index,
        spec: {
          serverless: {
            cloud: this.config.cloud,
            region: this.config.region,
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async getIndex() {
    try {
      const { host, name } = await this.client.describeIndex(this.config.index);

      return this.client.Index(name, host);
    } catch (err) {
      throw err;
    }
  }

  async vectorStore(): Promise<PineconeStore> {
    try {
      return await PineconeStore.fromExistingIndex(this.embedding.model, {
        pineconeIndex: await this.getIndex(),
      });
    } catch (err: unknown) {
      this.logger.error(err);
      throw err;
    }
  }

  async similaritySearch<Document extends ExtendedDocument>(
    question: string,
    questionPatterns: QuestionPatterns,
  ): Promise<Array<Document>> {
    try {
      const searchService = new SearchService(questionPatterns);

      const { filter, limit } = searchService.getSearchParams(question);

      const store = await this.vectorStore();

      return (await store.similaritySearch(
        question,
        limit,
        filter,
      )) as Array<Document>;
    } catch (err: unknown) {
      this.logger.error(err);

      throw err;
    }
  }
}

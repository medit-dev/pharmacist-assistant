import { Injectable, Logger } from '@nestjs/common';
import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { PineconeConfig } from 'src/core/infrastructure/database/vector/adapters/pinecone/PineconeConfig';
import { Index, Pinecone } from '@pinecone-database/pinecone';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';

@Injectable()
export class PineconeAdapter extends VectorDatabasePort<Index> {
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
  }

  async getIndex() {
    try {
      const { host, name } = await this.client.describeIndex(this.config.index);

      return this.client.Index(name, host);
    } catch (err) {
      throw err;
    }
  }
}

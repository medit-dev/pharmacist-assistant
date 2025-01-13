import { Command, CommandRunner } from 'nest-commander';
import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { Index } from '@pinecone-database/pinecone';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import { PineconeStore } from '@langchain/pinecone';

@Command({ description: 'Create Embedding', name: 'create-embedding' })
export class CreateEmbeddingCommand extends CommandRunner {
  constructor(
    private readonly vectorDatabase: VectorDatabasePort<Index>,
    private readonly modelConfig: ModelConfig,
  ) {
    super();
  }

  async run() {
    let pineconeIndex = await this.vectorDatabase.getIndex();

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: this.modelConfig.apiKey,
      model: this.modelConfig.name,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    console.log(vectorStore);
  }
}

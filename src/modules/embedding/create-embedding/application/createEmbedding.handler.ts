import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { Index } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { EmbeddingPort } from 'src/core/infrastructure/embedding/embedding.port';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { SplitterPort } from 'src/core/infrastructure/spliter/splitter.port';
import { Document } from '@langchain/core/documents';
import { CsvProvider } from 'src/modules/embedding/create-embedding/infrastructure/csv/csv.provider';

@Injectable()
export class CreateEmbeddingHandler {
  private readonly logger = new Logger(CreateEmbeddingHandler.name);

  constructor(
    private readonly vectorDatabase: VectorDatabasePort<Index>,
    private readonly embeddingPort: EmbeddingPort<HuggingFaceInferenceEmbeddings>,
    private readonly csvParser: CsvProvider,
    readonly splliter: SplitterPort<RecursiveCharacterTextSplitter, Document>,
  ) {}

  async handle() {
    try {
      await this.csvParser.parse();
    } catch (err: unknown) {
      this.logger.error(`Error parsing CSV: ${err}`);
      throw err;
    }
    let pineconeIndex = await this.vectorDatabase.getIndex();

    const vectorStore = await PineconeStore.fromExistingIndex(
      this.embeddingPort.model,
      {
        pineconeIndex,
      },
    );

    console.log(vectorStore);
  }
}

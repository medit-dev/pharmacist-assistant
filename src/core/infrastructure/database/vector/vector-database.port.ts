import { QuestionPatterns } from 'src/modules/chat/corresponding/providers/search.service';
import { EmbeddingPort } from 'src/core/infrastructure/embedding/embedding.port';
import { Inject } from '@nestjs/common';
import { ExtendedDocument } from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';

export abstract class VectorDatabasePort<Index, EmbeddingModel, Store> {
  @Inject(EmbeddingPort)
  protected readonly embedding: EmbeddingPort<EmbeddingModel>;

  abstract vectorStore(): Promise<Store> | Store;
  abstract getIndex(): Promise<Index | undefined> | Index | undefined;
  abstract similaritySearch<Document extends ExtendedDocument>(
    question: string,
    questionPatterns: QuestionPatterns,
  ): Promise<Array<Document>> | Array<Document>;
  abstract createIndex(): Promise<void> | void;
}

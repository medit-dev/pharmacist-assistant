import { Module } from '@nestjs/common';
import { CreateEmbeddingCommand } from 'src/modules/embedding/create-embedding/presentation/createEmbedding.command';
import { CreateEmbeddingHandler } from 'src/modules/embedding/create-embedding/application/createEmbedding.handler';
import { CsvProvider } from 'src/modules/embedding/create-embedding/infrastructure/csv/csv.provider';
import { DocumentProvider } from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';

@Module({
  exports: [CreateEmbeddingCommand],
  providers: [
    CreateEmbeddingCommand,
    CreateEmbeddingHandler,
    CsvProvider,
    DocumentProvider,
  ],
})
export class CreateEmbeddingModule {}

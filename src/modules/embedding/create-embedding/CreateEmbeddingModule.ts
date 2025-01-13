import { Module } from '@nestjs/common';
import { CreateEmbeddingCommand } from 'src/modules/embedding/create-embedding/presentation/CreateEmbeddingCommand';

@Module({
  exports: [CreateEmbeddingCommand],
  providers: [CreateEmbeddingCommand],
})
export class CreateEmbeddingModule {}

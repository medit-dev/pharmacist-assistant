import { Module } from '@nestjs/common';
import { CreateEmbeddingModule } from 'src/modules/embedding/create-embedding/createEmbedding.module';

@Module({
  exports: [CreateEmbeddingModule],
  imports: [CreateEmbeddingModule],
})
export class EmbeddingModule {}

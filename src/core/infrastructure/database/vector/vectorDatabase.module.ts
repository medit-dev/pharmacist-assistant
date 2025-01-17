import { Global, Module } from '@nestjs/common';
import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { PineconeAdapter } from 'src/core/infrastructure/database/vector/adapters/pinecone/pinecone.adapter';
import { EmbeddingModule } from 'src/core/infrastructure/embedding/embedding.module';

@Global()
@Module({
  exports: [VectorDatabasePort],
  imports: [EmbeddingModule],
  providers: [
    {
      provide: VectorDatabasePort,
      useClass: PineconeAdapter,
    },
  ],
})
export class VectorDatabaseModule {}

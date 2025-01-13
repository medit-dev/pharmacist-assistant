import { Global, Module } from '@nestjs/common';
import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { PineconeAdapter } from 'src/core/infrastructure/database/vector/adapters/pinecone/pinecone.adapter';

@Global()
@Module({
  exports: [VectorDatabasePort],
  providers: [
    {
      provide: VectorDatabasePort,
      useClass: PineconeAdapter,
    },
  ],
})
export class VectorDatabaseModule {}

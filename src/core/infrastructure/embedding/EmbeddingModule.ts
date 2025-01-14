import { Global, Module } from '@nestjs/common';
import { EmbeddingPort } from 'src/core/infrastructure/embedding/embedding.port';
import { HuggingfaceAdapter } from 'src/core/infrastructure/embedding/adapters/hugging-face/huggingface.adapter';

@Global()
@Module({
  exports: [EmbeddingPort],
  providers: [
    {
      provide: EmbeddingPort,
      useClass: HuggingfaceAdapter,
    },
  ],
})
export class EmbeddingModule {}

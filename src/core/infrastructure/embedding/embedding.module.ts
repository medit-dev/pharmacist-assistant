import { Module } from '@nestjs/common';
import { EmbeddingPort } from 'src/core/infrastructure/embedding/embedding.port';
import { OpenAIAdapter } from 'src/core/infrastructure/embedding/adapters/openai/openai.adapter';

@Module({
  exports: [EmbeddingPort],
  providers: [
    {
      provide: EmbeddingPort,
      useClass: OpenAIAdapter,
    },
  ],
})
export class EmbeddingModule {}

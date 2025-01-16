import { Global, Module } from '@nestjs/common';
import { CorrespondingPort } from 'src/core/infrastructure/corresponding/corresponding.port';
import { OpenAIAdapter } from 'src/core/infrastructure/corresponding/adapters/openai/openai.adapter';

@Global()
@Module({
  exports: [CorrespondingPort],
  providers: [
    {
      provide: CorrespondingPort,
      useClass: OpenAIAdapter,
    },
  ],
})
export class CorrespondingModule {}

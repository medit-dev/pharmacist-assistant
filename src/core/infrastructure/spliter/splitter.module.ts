import { Global, Module } from '@nestjs/common';
import { RecursiveCharacterTextSplitterAdapter } from 'src/core/infrastructure/spliter/adapters/recursiveCharacterTextSplitter.adapter';
import { SplitterPort } from 'src/core/infrastructure/spliter/splitter.port';

@Global()
@Module({
  exports: [SplitterPort],
  providers: [
    {
      provide: SplitterPort,
      useClass: RecursiveCharacterTextSplitterAdapter,
    },
  ],
})
export class SplitterModule {}

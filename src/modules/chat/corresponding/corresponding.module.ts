import { Module } from '@nestjs/common';
import { CorrespondingController } from 'src/modules/chat/corresponding/presentation/corresponding.controller';

@Module({
  controllers: [CorrespondingController],
  providers: [],
})
export class CorrespondingModule {}

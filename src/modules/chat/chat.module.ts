import { Module } from '@nestjs/common';
import { CorrespondingModule } from 'src/modules/chat/corresponding/corresponding.module';

@Module({
  imports: [CorrespondingModule],
})
export class ChatModule {}

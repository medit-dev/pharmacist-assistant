import { Module } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig } from 'src/core/infrastructure/config/configs/RootConfig';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      isGlobal: true,
      load: dotenvLoader({
        separator: '__',
      }),
      schema: RootConfig,
    }),
  ],
})
export class ConfigModule {}

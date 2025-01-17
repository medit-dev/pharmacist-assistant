import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ErrorHandlerModule } from 'src/core/infrastructure/error-handler/errorHandler.module';
import { ConfigModule } from 'src/core/infrastructure/config/ConfigModule';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { VectorDatabaseModule } from 'src/core/infrastructure/database/vector/vectorDatabase.module';
import { EmbeddingModule } from 'src/modules/embedding/embedding.module';
import { SplitterModule } from 'src/core/infrastructure/spliter/splitter.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
        return {
          pinoHttp: {
            level: config.logLevel,
            transport: {
              options: {
                ignore: 'pid,hostname,context',
              },
              target: 'pino-pretty',
            },
          },
        };
      },
    }),
    ConfigModule,
    ErrorHandlerModule,
    VectorDatabaseModule,
    SplitterModule,
    EmbeddingModule,
  ],
})
export class AppModule {}

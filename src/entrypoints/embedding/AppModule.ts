import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ErrorHandlerModule } from 'src/core/infrastructure/error-handler/ErrorHandlerModule';
import { ConfigModule } from 'src/core/infrastructure/config/ConfigModule';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { VectorDatabaseModule } from 'src/core/infrastructure/database/vector/VectorDatabaseModule';
import { EmbeddingModule as EmbedderModule } from 'src/core/infrastructure/embedding/EmbeddingModule';
import { EmbeddingModule } from 'src/modules/embedding/EmbeddingModule';
import { SplitterModule } from 'src/core/infrastructure/spliter/SplitterModule';

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
    EmbedderModule,
    SplitterModule,
    EmbeddingModule,
  ],
})
export class AppModule {}

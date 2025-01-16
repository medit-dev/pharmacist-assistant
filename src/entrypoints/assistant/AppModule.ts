import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ErrorHandlerModule } from 'src/core/infrastructure/error-handler/errorHandler.module';
import { ConfigModule } from 'src/core/infrastructure/config/ConfigModule';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { ChatModule } from 'src/modules/chat/chat.module';
import { VectorDatabaseModule } from 'src/core/infrastructure/database/vector/vectorDatabase.module';
import { CorrespondingModule } from 'src/core/infrastructure/corresponding/corresponding.module';

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
    CorrespondingModule,
    ChatModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ErrorHandlerModule } from 'src/core/infrastructure/error-handler/ErrorHandlerModule';
import { ConfigModule } from 'src/core/infrastructure/config/ConfigModule';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';

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
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
// import { ConfigModule } from 'src/core/infrastructure/config/ConfigModule';
import { RootConfig } from 'src/core/infrastructure/config/configs/RootConfig';
import { ErrorHandlerModule } from 'src/core/infrastructure/error-handler/ErrorHandlerModule';
import { ConfigModule } from 'src/core/infrastructure/config/ConfigModule';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [RootConfig],
      useFactory: (config: RootConfig) => {
        console.log(config);
        return {
          pinoHttp: {
            level: config.app.logLevel,
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

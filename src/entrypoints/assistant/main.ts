import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Server } from 'node:http';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import { RootConfig } from 'src/core/infrastructure/config/configs/RootConfig';
import { AppModule } from 'src/entrypoints/assistant/AppModule';

/**
 * Main application
 */
let app: NestExpressApplication;

export async function bootstrap(): Promise<void> {
  try {
    if (!app) {
      app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
      });
    }
    const appConfig = app.get(RootConfig);

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();

    app.enableCors({
      credentials: true,
    });

    app.use(compression());

    app.use(helmet());

    app.useLogger(app.get(Logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          exposeUnsetFields: false,
        },
        whitelist: true,
      }),
    );

    const server: Server = app.getHttpAdapter().getHttpServer();
    server.keepAliveTimeout = appConfig.app.timeout;
    server.headersTimeout = appConfig.app.timeout;

    await app.listen(appConfig.app.port, appConfig.app.hostname).then(() => {
      // eslint-disable-next-line no-console
      console.debug(`Port: ${appConfig.app.port}`);
      // eslint-disable-next-line no-console
      console.debug(`Env: ${appConfig.env}`);
      return;
    });
  } catch (error: unknown) {
    console.error(error);
  }
}
bootstrap().catch((error) => console.error(error));

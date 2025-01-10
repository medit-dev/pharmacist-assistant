import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'node:http';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';

import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { RootConfig } from '../../core/infrastructure/config/root-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

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
      origin: [appConfig.app.feAppUrl, 'http://localhost:4200'],
      credentials: true,
    });

    app.use(compression());

    app.use(helmet());

    app.use(cookieParser(appConfig.app.jwtSecret));

    app.useLogger(app.get(Logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          exposeUnsetFields: false,
        },
      }),
    );

    app.use(compression());

    app.enableVersioning({
      type: VersioningType.HEADER,
      header: appConfig.app.versionHeaderName,
    });

    if (appConfig.app.swaggerEnabled) {
      console.log('Swagger enabled');
      const config = new DocumentBuilder()
        .setTitle('Admin Gateway API :)')
        .setDescription('The api for admin')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup(`${appConfig.app.documentationPath}`, app, document);
    }

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
bootstrap().catch(error => console.error(error));

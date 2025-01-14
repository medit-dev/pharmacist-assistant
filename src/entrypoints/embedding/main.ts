import { INestApplicationContext } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { CommandFactory } from 'nest-commander';
import { AppModule } from 'src/entrypoints/embedding/AppModule';

/**
 * Main application
 */
let app: INestApplicationContext;

export async function bootstrap(): Promise<void> {
  try {
    if (!app) {
      app = await CommandFactory.createWithoutRunning(AppModule, {
        bufferLogs: true,
      });
    }
    app.useLogger(app.get(Logger));

    await CommandFactory.runApplication(app);
  } catch (error: unknown) {
    console.error(error);
  }
}
bootstrap().catch((error) => console.error(error));

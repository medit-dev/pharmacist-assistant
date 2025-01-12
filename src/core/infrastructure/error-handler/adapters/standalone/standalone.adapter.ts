import { Logger } from '@nestjs/common';
import { ErrorHandlerPort } from 'src/core/infrastructure/error-handler/error-handler.port';

export class StandaloneAdapter extends ErrorHandlerPort {
  private readonly logger = new Logger('ErrorHandler');

  captureException(exception: unknown): void {
    this.logger.error(exception);
  }

  captureMessage(message: string): void {
    this.logger.error(message);
  }
}

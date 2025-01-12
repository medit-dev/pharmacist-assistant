export abstract class ErrorHandlerPort {
  abstract captureException(exception: unknown): void;
  abstract captureMessage(message: string): void;
}

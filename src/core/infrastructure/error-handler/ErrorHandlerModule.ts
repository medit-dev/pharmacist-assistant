import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorHandlerInterceptor } from 'src/core/infrastructure/error-handler/interceptor/error-handler.interceptor';
import { ErrorHandlerPort } from 'src/core/infrastructure/error-handler/error-handler.port';
import { StandaloneAdapter } from 'src/core/infrastructure/error-handler/adapters/standalone/standalone.adapter';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlerInterceptor,
    },
    {
      provide: ErrorHandlerPort,
      useClass: StandaloneAdapter,
    },
  ],
})
export class ErrorHandlerModule {}

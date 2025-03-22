import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { HealthController, MetricsController } from './controllers';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { metricsProviders } from './providers';
import { MetricsService } from './services';

@Module({
  imports: [
    TerminusModule,
    PrometheusModule.register({
      controller: MetricsController,
    }),
  ],
  controllers: [HealthController],
  providers: [
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    ...metricsProviders,
  ],
})
export class ObservabilityModule {}

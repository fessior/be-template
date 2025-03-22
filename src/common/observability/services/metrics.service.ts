import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Summary } from 'prom-client';

import { MetricsDto } from '../dtos';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsCounter: Counter,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDurationHistogram: Histogram,
    @InjectMetric('http_request_duration_percentiles')
    private readonly httpRequestDurationSummary: Summary,
    @InjectMetric('http_response_status_codes')
    private readonly httpStatusCodesCounter: Counter,
  ) {}

  recordMetrics(metricsData: MetricsDto): void {
    const { method, route, statusCode, duration } = metricsData;

    this.httpRequestsCounter.inc();

    this.httpRequestsCounter.inc({ method, route });

    this.httpRequestDurationHistogram.observe({ method, route }, duration);

    this.httpRequestDurationSummary.observe({ method, route }, duration);

    this.httpStatusCodesCounter.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Summary } from 'prom-client';

import { MetricsDto } from '../dtos';

// eslint-disable-next-line @typescript-eslint/naming-convention
enum STATUS_CODE_TYPE {
  CLIENT_ERROR = '4xx',
  SERVER_ERROR = '5xx',
  SUCCESS = '2xx',
  REDIRECT = '3xx',
  INFORMATION = '1xx',
}

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

    let statusType = STATUS_CODE_TYPE.INFORMATION;
    if (statusCode >= 500) {
      statusType = STATUS_CODE_TYPE.SERVER_ERROR;
    } else if (statusCode >= 400) {
      statusType = STATUS_CODE_TYPE.CLIENT_ERROR;
    } else if (statusCode >= 300) {
      statusType = STATUS_CODE_TYPE.REDIRECT;
    } else if (statusCode >= 200) {
      statusType = STATUS_CODE_TYPE.SUCCESS;
    }

    this.httpStatusCodesCounter.inc({ method, route, status_code: statusType });
  }
}

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { CommonConfig, commonConfigObj } from './common/config';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  const commonConfig = <CommonConfig>app.get(commonConfigObj.KEY);
  const prod = commonConfig.nodeEnv === 'production';

  app.use(
    compression({
      threshold: 0,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: prod ? undefined : false,
      crossOriginEmbedderPolicy: prod ? undefined : false,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  return app;
}

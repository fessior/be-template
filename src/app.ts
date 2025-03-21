import { INestApplication, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

export function configApp(app: INestApplication): INestApplication {
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
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  return app;
}

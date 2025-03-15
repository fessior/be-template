import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CommonConfig, commonConfigObj } from './common/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const { port } = <CommonConfig>app.get(commonConfigObj.KEY);
  await app.listen(port, () => {
    console.info(`listening on port ${port}`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error(err, 'Server startup failed');
  process.exit(1);
});

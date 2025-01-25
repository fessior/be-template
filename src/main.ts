import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.PORT);
  await app.listen(parseInt(process.env.PORT, 10));
}

(async (): Promise<void> => {
  try {
    await bootstrap();

    if (process.send) {
      process.send('ready');
    }
  } catch (error) {
    console.error(error, 'Bootstrap');
  }
})();

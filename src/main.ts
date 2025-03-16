import { createApp } from './app';
import { CommonConfig, commonConfigObj } from './common/config';

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const { port } = <CommonConfig>app.get(commonConfigObj.KEY);
  await app.listen(port, () => {
    console.info(`listening on port ${port}`);
  });
}

bootstrap()
  .then(() => {
    // Notify the deployment platform that we're ready. This is used in PM2's
    // graceful startup process
    if (process.send) process.send('ready');
  })
  .catch((err: unknown) => {
    console.error(err, 'Server startup failed');
    process.exit(1);
  });

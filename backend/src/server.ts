import 'reflect-metadata';
import { app } from './app';
import { env } from './config/env';
import { closeDataSourceConnections, createDataSourceConnections } from './database/connections';

async function bootstrap(): Promise<void> {
  await createDataSourceConnections();

  const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      closeDataSourceConnections().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

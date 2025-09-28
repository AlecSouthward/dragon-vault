import Fastify from 'fastify';

import ENV from './env';

import db from './plugins/db';
import security from './plugins/security';

import apiRoutes from './routes/api';

const app = Fastify({
  logger: {
    level: ENV.NODE_ENV === 'production' ? 'warn' : 'debug',
    transport:
      ENV.NODE_ENV === 'production'
        ? undefined
        : { target: 'pino-pretty', options: { colorize: true } },
  },
});

await app.register(db);
await app.register(security);

await app.register(apiRoutes, { prefix: '/api/v1' });

app.get('/health', async () => ({ ok: true }));

app
  .listen({ port: ENV.PORT, host: '0.0.0.0' })
  .then((addr) => app.log.info(`listening on ${addr}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

export default app;

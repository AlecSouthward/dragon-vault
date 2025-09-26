import Fastify from 'fastify';

import ENV from './env';

import db from './plugins/db';
import security from './plugins/security';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = Fastify({
  logger: { level: ENV.NODE_ENV === 'production' ? 'warn' : 'debug' },
});

await app.register(db);
await app.register(security);

await app.register(authRoutes, { prefix: '/auth' });
await app.register(userRoutes, { prefix: '/user' });

app.get('/health', async () => ({ ok: true }));

app
  .listen({ port: ENV.PORT, host: '0.0.0.0' })
  .then((addr) => app.log.info(`listening on ${addr}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

export default app;

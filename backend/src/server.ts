import Fastify from 'fastify';

import ENV from './env';

import db from './plugins/db';
import security from './plugins/security';

import auth from './routes/auth';

const app = Fastify({
  logger: { level: ENV.NODE_ENV === 'production' ? 'warn' : 'debug' },
});

await app.register(db);
await app.register(security);
await app.register(auth);

app.get('/health', async () => ({ ok: true }));

app
  .listen({ port: ENV.PORT, host: '0.0.0.0' })
  .then((addr) => app.log.info(`listening on ${addr}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

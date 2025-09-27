import fastifyPostgres from '@fastify/postgres';
import fp from 'fastify-plugin';

import ENV from '../env';

export default fp(async (app) => {
  await app.register(fastifyPostgres, { connectionString: ENV.DATABASE_URL });

  try {
    const { rows } = await app.pg.query('SELECT NOW()');
    app.log.info({ time: rows[0].now }, 'PostgreSQL connection active');
  } catch {
    app.log.error('Failed to connect to PostgreSQL instance');
    process.exit(1);
  }
});

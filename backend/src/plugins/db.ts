import fastifyPostgres from '@fastify/postgres';
import fp from 'fastify-plugin';

import { ENV } from '../env';

export default fp(async (app) => {
  app.register(fastifyPostgres, { connectionString: ENV.DATABASE_URL });
});

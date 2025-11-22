import cors from '@fastify/cors';
import fp from 'fastify-plugin';

import ENV from '../env';

export default fp(async (app) => {
  await app.register(cors, { origin: ENV.CORS_ORIGIN, credentials: true });
});

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fp from 'fastify-plugin';

import ENV from '../env';

export default fp(async (app) => {
  await app.register(cors, { origin: ENV.CORS_ORIGIN, credentials: true });
  await app.register(cookie, { hook: 'onRequest', secret: ENV.COOKIE_SECRET });

  await app.register(jwt, {
    secret: ENV.JWT_SECRET,
    cookie: { cookieName: 'token', signed: true },
  });
});

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt, { UserType } from '@fastify/jwt';
import fp from 'fastify-plugin';

import { ENV } from '../env';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: import('fastify').preHandlerHookHandler;
  }
}

export default fp(async (app) => {
  await app.register(cors, { origin: true, credentials: true });
  await app.register(cookie, { hook: 'onRequest' });
  await app.register(jwt, {
    secret: ENV.JWT_SECRET,
    cookie: { cookieName: 'token', signed: false },
  });

  app.decorate('authenticate', async (req, res) => {
    try {
      const payload = await req.jwtVerify();
      req.user = payload as UserType;
    } catch {
      return res.status(401).send({ error: 'Unauthorized' });
    }
  });
});

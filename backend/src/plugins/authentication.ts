import fastifyCookie from '@fastify/cookie';
import { httpErrors } from '@fastify/sensible';
import fastifySession from '@fastify/session';
import type { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { SESSION_MAX_AGE } from '../config/cookies';
import ENV from '../env';

const UNAUTHENTICATED_ERROR = 'Failed to authenticate your User Account.';

export default fp(async (app) => {
  await app.register(fastifyCookie);

  await app.register(fastifySession, {
    secret: ENV.COOKIE_SECRET,
    cookie: {
      domain: ENV.NODE_ENV === 'production' ? ENV.CORS_ORIGIN : undefined,
      httpOnly: true,
      sameSite: 'strict',
      secure: ENV.NODE_ENV === 'production',
      priority: 'high',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    },
    cookieName: 'dragonVaultSession',
  });
});

/** Will also check for a session cookie. Throws an exception if none is found. */
export const checkAuthentication = async (req: FastifyRequest) => {
  if (!req.session.userAccount) {
    throw httpErrors.unauthorized(UNAUTHENTICATED_ERROR);
  }
};

/** Will also check for authentication. Throws an exception if either are invalid. */
export const checkAdminStatus = async (req: FastifyRequest) => {
  await checkAuthentication(req);

  if (!req.session.userAccount?.admin) {
    throw httpErrors.forbidden(
      'Your User Account does not have Admin priviledges.'
    );
  }
};

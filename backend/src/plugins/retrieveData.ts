import type { FastifyReply, FastifyRequest } from 'fastify';

import { Cookie } from '../types/cookie';

import { getUserFromCookie } from '../utils/user';

import app from '../server';

export const getUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const payload = await req.jwtVerify();
    const cookie = payload as Cookie;

    if (!cookie?.id) {
      return res.badRequest();
    }

    const user = await getUserFromCookie(cookie);

    if (!user) {
      return res.notFound();
    }

    req.userFromCookie = user;
  } catch (err) {
    app.log.error(err, 'User is unauthorized');
    return res.unauthorized();
  }
};

export const getIsAdmin = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.userFromCookie) {
    app.log.error('Missing user cookie as the getUser preHandler was not run');
    return res.internalServerError();
  } else if (!req.userFromCookie.admin) {
    app.log.error(
      { userId: req.userFromCookie.id },
      'Authorized user is not an admin'
    );

    return res.forbidden();
  }
};

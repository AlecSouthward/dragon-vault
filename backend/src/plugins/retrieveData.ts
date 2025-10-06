import type { FastifyReply, FastifyRequest } from 'fastify';

import { Cookie } from '../types/cookie';

import { getUserFromCookie } from '../utils/user';

import app from '../server';

export const getUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const payload = await req.jwtVerify();
    const cookie = payload as Cookie;

    if (!cookie?.id) {
      throw new Error('Missing user id from cookie');
    }

    const user = await getUserFromCookie(cookie);

    req.userFromCookie = user;
  } catch (err) {
    app.log.error(err, 'User is unauthorized');
    return res.status(401).send({ error: 'Unauthorized' });
  }
};

export const getIsAdmin = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.userFromCookie) {
    app.log.error('Missing user cookie as the getUser preHandler was not run');

    return res.status(401);
  } else if (!req.userFromCookie.admin) {
    app.log.error(
      { userId: req.userFromCookie.id },
      'The user is not an admin'
    );
    return res.status(403).send({ error: 'Authorized user is not an admin' });
  }
};

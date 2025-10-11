import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { Cookie } from '../types/cookie';

import { getUserFromCookie } from '../utils/user';

import app from '../server';

export const getUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const payload = await req.jwtVerify();
    const cookie = payload as Cookie;

    if (!cookie?.id) {
      return res
        .code(StatusCodes.BAD_REQUEST)
        .send({ message: 'Missing user id from cookie' });
    }

    const user = await getUserFromCookie(cookie);

    if (!user) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: 'No user was found' });
    }

    req.userFromCookie = user;
  } catch (err) {
    app.log.error(err, 'User is unauthorized');
    return res.status(401).send({ message: 'Unauthorized' });
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
    return res.status(403).send({ message: 'Authorized user is not an admin' });
  }
};

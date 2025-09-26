import type { FastifyReply, FastifyRequest } from 'fastify';

import { Cookie } from '../types/cookie';

import { getUserFromCookie } from '../utils/user';

export const getUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const payload = await req.jwtVerify();
    const user = await getUserFromCookie(payload as Cookie);

    req.userFromCookie = user;
  } catch {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};

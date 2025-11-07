import type { FastifyReply, FastifyRequest } from 'fastify';

import { Cookie } from '../types/cookie';

import { getUserFromCookie } from '../utils/user';

const UNAUTHENTICATED_ERROR = 'Failed to authenticate your User Account.';

export const getUser = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const payload = await req.jwtVerify();
    const cookie = payload as Cookie;

    if (!cookie?.id) {
      return res.badRequest(UNAUTHENTICATED_ERROR);
    }

    const user = await getUserFromCookie(cookie);

    if (!user) {
      return res.notFound(UNAUTHENTICATED_ERROR);
    }

    req.userFromCookie = user;
  } catch {
    return res.unauthorized(UNAUTHENTICATED_ERROR);
  }
};

export const getIsAdmin = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.userFromCookie) {
    return res.internalServerError(UNAUTHENTICATED_ERROR);
  } else if (!req.userFromCookie.admin) {
    return res.forbidden('Your User Account does not have Admin priviledges.');
  }
};

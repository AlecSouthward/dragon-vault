import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UUID } from 'node:crypto';
import z from 'zod';

import { Cookie } from '../types/cookie.js';

import { verifyPassword } from '../utils/passwordHash.js';

// TODO:
// Implement refresh tokens
// Store and validate refresh tokens
// Store client IP and User alongside stored refresh token
// Check for suspicious activity on a refresh token

const LOGIN_FAILED_MESSAGE = 'Invalid credentials.';

const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/login',
    {
      schema: {
        body: z.strictObject({
          username: z.string().nonoptional(),
          password: z.string().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { username, password } = req.body;

      const user = await app.db
        .selectFrom('userAccount')
        .select(['id', 'username', 'displayName', 'password', 'admin'])
        .where((eb) => eb('username', '=', username).and('deleted', '=', false))
        .executeTakeFirst();

      if (!user) {
        return res.notFound(LOGIN_FAILED_MESSAGE);
      }

      const passwordsMatch = await verifyPassword(user.password, password);

      if (!passwordsMatch) {
        return res.unauthorized(LOGIN_FAILED_MESSAGE);
      }

      const userCookie: Cookie = {
        id: user.id as UUID,
        username: user.username,
        admin: user.admin,
      };

      res.setCookie('token', app.jwt.sign(userCookie), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      res.send({
        user: { id: user.id, username: user.username, admin: user.admin },
        message: 'Successfully authenticated.',
      });
    }
  );
};

export default authRoutes;

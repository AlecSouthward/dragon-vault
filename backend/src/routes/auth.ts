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
        .where('username', '=', username)
        .executeTakeFirstOrThrow();

      const passwordsMatch = await verifyPassword(user.password, password);

      if (!passwordsMatch) {
        app.log.error(
          { username },
          'Failed to log user in as their password was wrong'
        );

        return res.unauthorized();
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

      res.send({ id: user.id, username: user.username, admin: user.admin });
    }
  );
};

export default authRoutes;

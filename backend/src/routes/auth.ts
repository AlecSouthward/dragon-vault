import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
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

      let user;
      try {
        user = await app.db
          .selectFrom('userAccount')
          .select(['id', 'username', 'password', 'admin'])
          .where('username', '=', username)
          .executeTakeFirst();

        if (!user) {
          app.log.error({ username }, 'No user found when logging in');
          return res
            .code(StatusCodes.UNAUTHORIZED)
            .send({ message: 'Invalid credentials' });
        }
      } catch (err) {
        app.log.error(err, 'Failed to find user in database');

        return res
          .code(StatusCodes.OK)
          .send({ message: 'An error occurred when fetching your user' });
      }

      try {
        const passwordsMatch = await verifyPassword(user.password, password);

        if (!passwordsMatch) {
          app.log.error(
            { username },
            'Failed to log user in as their password was wrong'
          );

          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send({ message: 'Invalid credentials' });
        }
      } catch (err) {
        app.log.error(
          { err, username },
          "An error occurred when verifying user's password"
        );

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: 'Failed to verify your password' });
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

      res
        .code(StatusCodes.OK)
        .send({ id: user.id, username: user.username, admin: user.admin });
    }
  );
};

export default authRoutes;

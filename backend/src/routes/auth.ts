import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { Cookie } from '../types/cookie.js';
import { User } from '../types/domain.js';

import { verifyPassword } from '../utils/passwordHash.js';

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
        const selectUserResult = await app.pg.query<User>(
          'SELECT id, username, password, is_admin AS "isAdmin" FROM users WHERE username = $1',
          [username]
        );

        if (selectUserResult === null) {
          res.code(500).send({ error: 'Failed to find user' });
        } else if (
          selectUserResult.rowCount === 0 ||
          !selectUserResult.rowCount
        ) {
          return res.code(401).send({ error: 'User not found' });
        } else if (selectUserResult.rowCount > 1) {
          return res.code(409).send({ error: 'More than one user found' });
        }

        user = selectUserResult.rows[0];
      } catch (error) {
        app.log.error({ error }, 'Failed to find user in database');

        return res
          .code(500)
          .send({ error: 'An error occurred when fetching your user' });
      }

      try {
        const passwordsMatch = await verifyPassword(user.password, password);

        if (!passwordsMatch) {
          return res.status(401).send({ error: 'Invalid credentials' });
        }
      } catch (error) {
        app.log.error(
          { error, username },
          "An error occurred when verifying user's password"
        );

        return res
          .status(500)
          .send({ error: 'Failed to verify your password' });
      }

      const userCookie: Cookie = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };

      res.setCookie('token', app.jwt.sign(userCookie), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      res.send({ id: user.id, username: user.username, isAdmin: user.isAdmin });
    }
  );
};

export default authRoutes;

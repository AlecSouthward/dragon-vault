import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { Cookie } from '../types/cookie.js';
import { User } from '../types/domain.js';

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
        const selectUserResult = await app.pg.query<User>(
          'SELECT id, username, password, admin FROM user_account WHERE username = $1',
          [username]
        );

        if (selectUserResult === null) {
          app.log.error('Failed to find user in database');
          res.code(500).send({ message: 'Failed to find user' });
        } else if (
          selectUserResult.rowCount === 0 ||
          !selectUserResult.rowCount
        ) {
          return res.code(401).send({ message: 'User not found' });
        } else if (selectUserResult.rowCount > 1) {
          return res.code(409).send({ message: 'More than one user found' });
        }

        user = selectUserResult.rows[0];
      } catch (err) {
        app.log.error(err, 'Failed to find user in database');

        return res
          .code(500)
          .send({ message: 'An error occurred when fetching your user' });
      }

      try {
        const passwordsMatch = await verifyPassword(user.password, password);

        if (!passwordsMatch) {
          return res.status(401).send({ message: 'Invalid credentials' });
        }
      } catch (err) {
        app.log.error(
          { err, username },
          "An error occurred when verifying user's password"
        );

        return res
          .status(500)
          .send({ message: 'Failed to verify your password' });
      }

      const userCookie: Cookie = {
        id: user.id,
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

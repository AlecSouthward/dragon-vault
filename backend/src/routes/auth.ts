import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

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

      const userAccount = await app.db
        .selectFrom('userAccount')
        .selectAll()
        .where((eb) => eb('username', '=', username).and('deleted', '=', false))
        .executeTakeFirst();

      if (!userAccount) {
        return res.notFound(LOGIN_FAILED_MESSAGE);
      }

      const passwordsMatch = await verifyPassword(
        userAccount.password,
        password
      );

      if (!passwordsMatch) {
        return res.unauthorized(LOGIN_FAILED_MESSAGE);
      }

      req.session.userAccount = userAccount;

      res.send({
        user: {
          id: userAccount.id,
          username: userAccount.username,
          admin: userAccount.admin,
        },
        message: 'Successfully authenticated.',
      });
    }
  );
};

export default authRoutes;

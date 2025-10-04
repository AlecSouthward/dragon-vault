import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UUID } from 'node:crypto';
import z from 'zod';

import { getIsAdmin, getUser } from '../plugins/retrieveData';

import { createUser } from '../utils/user';

const adminUserRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', getUser);
  app.addHook('preHandler', getIsAdmin);

  app.post(
    '/users',
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
      const createUserResponse = await createUser(username, password);

      return res.code(createUserResponse.httpCode).send({
        message: createUserResponse.message,
        error: createUserResponse.error,
      });
    }
  );

  // TODO: Add routes for deleting/managing users

  app.post('/invite', async (_, res) => {
    try {
      const createUserInviteQuery = await app.pg.query<{ id: UUID }>(
        'INSERT INTO user_invite DEFAULT VALUES RETURNING id'
      );

      return res.code(200).send({ inviteId: createUserInviteQuery.rows[0].id });
    } catch (err) {
      app.log.error(err, 'An error occurred when creating a user invite');

      return res.code(500).send({ error: 'Failed to create a user invite' });
    }
  });
};

export default adminUserRoutes;

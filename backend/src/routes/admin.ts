import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
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
        message: createUserResponse.message || createUserResponse.error,
      });
    }
  );

  // TODO: Add routes for deleting/managing users

  app.post('/invite', async (_, res) => {
    try {
      const newInviteId = await app.db
        .insertInto('userInvite')
        .defaultValues()
        .returning('id')
        .executeTakeFirst();

      return res.code(200).send({ inviteId: newInviteId });
    } catch (err) {
      app.log.error(err, 'An error occurred when creating a user invite');

      return res.code(500).send({ message: 'Failed to create a user invite' });
    }
  });
};

export default adminUserRoutes;

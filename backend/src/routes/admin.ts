import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { getIsAdmin, getUser } from '../plugins/retrieveData';

import { throwDragonVaultError } from '../utils/error';
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

      await createUser(username, password);

      return res.send({ message: 'Successfully created a new User Account.' });
    }
  );

  // TODO: Add routes for deleting/managing users

  app.post('/invite', async (_, res) => {
    const newInviteId = await app.db
      .insertInto('userInvite')
      .defaultValues()
      .returning('id')
      .executeTakeFirstOrThrow(
        throwDragonVaultError('Failed to create User Invite.')
      );

    return res.send({
      inviteId: newInviteId,
      message: 'Successfully created a User Invite.',
    });
  });
};

export default adminUserRoutes;

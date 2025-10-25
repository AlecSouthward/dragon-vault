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

      if (createUserResponse.errorHttpCode) {
        app.log.error(createUserResponse.error);

        return res.code(createUserResponse.errorHttpCode.statusCode);
      }
    }
  );

  // TODO: Add routes for deleting/managing users

  app.post('/invite', async (_, res) => {
    const newInviteId = await app.db
      .insertInto('userInvite')
      .defaultValues()
      .returning('id')
      .executeTakeFirst();

    return res.send({ inviteId: newInviteId });
  });
};

export default adminUserRoutes;

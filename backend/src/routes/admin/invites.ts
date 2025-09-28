import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UUID } from 'node:crypto';

import { getIsAdmin, getUser } from '../../plugins/retrieveData';

const adminInviteRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', getUser);
  app.addHook('preHandler', getIsAdmin);

  app.post('/invite', async (_, res) => {
    try {
      const createUserInviteQuery = await app.pg.query<{ id: UUID }>(
        'INSERT INTO user_invites DEFAULT VALUES RETURNING id'
      );

      return res
        .code(200)
        .send({ inviteKey: createUserInviteQuery.rows[0].id });
    } catch (err) {
      app.log.error(err, 'An error occurred when creating a user invite');

      return res.code(500).send({ error: 'Failed to create a user invite' });
    }
  });
};

export default adminInviteRoutes;

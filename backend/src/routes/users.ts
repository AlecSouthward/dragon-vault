import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { getUser } from '../plugins/retrieveData';

import { createUser } from '../utils/user';

const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', getUser);

  app.get('/me', async (req, res) => {
    return res.code(200).send({ user: req.userFromCookie });
  });

  app.get('/me/campaigns', async (req, res) => {
    const { id: userId } = req.userFromCookie!;

    try {
      const getCampaignsQuery = await app.pg.query(
        'SELECT * FROM campaigns WHERE id IN (SELECT campaign_id FROM characters WHERE user_id = $1)',
        [userId]
      );

      return res.code(200).send({ campaigns: getCampaignsQuery.rows });
    } catch (err) {
      app.log.error(
        err,
        "An error occurred while searching for a user's campaigns"
      );

      return res
        .code(500)
        .send({ error: 'Failed to search for your campaigns' });
    }
  });

  app.post(
    '/invite/:id',
    {
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        body: z.strictObject({
          username: z.string().nonoptional(),
          password: z.string().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { id: inviteId } = req.params;
      const { username, password } = req.body;

      try {
        await app.pg.query('DELETE FROM user_invites WHERE id = $1', [
          inviteId,
        ]);

        const createUserResponse = await createUser(username, password);

        if (!createUserResponse.ok) {
          return res
            .code(createUserResponse.httpCode)
            .send({ error: createUserResponse.error });
        }

        await app.pg.query(
          'UPDATE user_invites SET used = TRUE WHERE id = $1',
          [inviteId]
        );

        return res
          .code(createUserResponse.httpCode)
          .send({ message: createUserResponse.message });
      } catch (err) {
        app.log.error(err, 'An error occurred when using the invite');

        return res.code(500).send({ error: 'Failed to use the invite' });
      }
    }
  );
};

export default usersRoutes;

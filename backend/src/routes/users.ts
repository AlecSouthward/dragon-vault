import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UUID } from 'node:crypto';
import z from 'zod';

import { INVITE_EXPIRE_OFFSET_MS } from '../config/invites';

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
        const inviteExpireCheckQuery = await app.pg.query<{
          createdDate: Date;
          usedByUserId: UUID;
        }>(
          'SELECT created_date AS "createdDate", used_by_user_id AS "usedByUserId" FROM user_invites WHERE id = $1',
          [inviteId]
        );

        if (inviteExpireCheckQuery.rows.length === 0) {
          return res
            .code(404)
            .send({ error: 'No invite was found with that id' });
        } else if (inviteExpireCheckQuery.rows[0]) {
          const queryResult = inviteExpireCheckQuery.rows[0];
          const expirationTime =
            queryResult.createdDate.getTime() + INVITE_EXPIRE_OFFSET_MS;
          const currentTime = Date.now();

          if (currentTime > expirationTime) {
            return res.code(410).send({ error: 'The invite has expired' });
          } else if (queryResult.usedByUserId) {
            return res
              .code(410)
              .send({ error: 'The invite has already been used' });
          }
        }

        const createUserResponse = await createUser(username, password);

        if (!createUserResponse.ok) {
          return res
            .code(createUserResponse.httpCode)
            .send({ error: createUserResponse.error });
        }

        await app.pg.query(
          'UPDATE user_invites SET used_by_user_id = $1 WHERE id = $2',
          [createUserResponse.newUserId, inviteId]
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

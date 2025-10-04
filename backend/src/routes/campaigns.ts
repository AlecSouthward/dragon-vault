import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UUID } from 'node:crypto';
import z from 'zod';

import { getUser } from '../plugins/retrieveData';

const campaignRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', getUser);

  app.post(
    '/',
    {
      schema: {
        body: z.strictObject({
          name: z.string().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { name: campaignName } = req.body;
      const { id: userId } = req.userFromCookie!;

      const createCampaignQuery = await app.pg.query<{ id: UUID }>(
        'INSERT INTO campaign (name, creator_user_account_id) VALUES ($1, $2) RETURNING id',
        [campaignName, userId]
      );

      if (createCampaignQuery.rows.length !== 1) {
        app.log.error(
          { query: createCampaignQuery.command },
          'An error occurred when creating a new campaign'
        );
        return res.code(500).send({ error: 'Failed to create campaign' });
      }

      return res.code(201).send({
        message: 'Successfully created campaign',
        id: createCampaignQuery.rows[0].id,
      });
    }
  );

  app.get(
    '/:userId',
    {
      schema: {
        params: z.strictObject({
          userId: z.string().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { userId } = req.params;
      const { id: currentUserId, admin: currentUserAdmin } =
        req.userFromCookie!;

      if (userId !== currentUserId && !currentUserAdmin) {
        return res.code(401).send({
          error: "You do not have permission to view other users' campaigns",
        });
      }

      const userCampaignsQuery = await app.pg.query(
        'SELECT * FROM campaign WHERE creator_user_account_id = $1 OR id IN (SELECT campaign_id FROM character WHERE user_id = $1)',
        [userId]
      );

      return res.code(200).send({ campaigns: userCampaignsQuery.rows });
    }
  );
};

export default campaignRoutes;

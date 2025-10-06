import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UUID } from 'node:crypto';
import z from 'zod';

import { Campaign } from '../types/domain';

import { getUser } from '../plugins/retrieveData';

const campaignRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', getUser);

  app.get(
    '/:campaignId',
    {
      schema: {
        params: z.strictObject({
          campaignId: z.string().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { campaignId } = req.params;
      const { id: currentUserId, admin: currentUserAdmin } =
        req.userFromCookie!;

      const campaignQuery = await app.pg.query<Campaign>(
        'SELECT * FROM campaign WHERE id = $1',
        [campaignId]
      );

      if (campaignQuery.rows.length > 1) {
        app.log.error(
          campaignQuery,
          'Multiple campaigns were returned from a single id, returning the oldest one'
        );
      }
      if (campaignQuery.rows.length === 0) {
        app.log.error(
          campaignQuery,
          `No campaign was found with the id: ${campaignId}`
        );

        return res
          .code(404)
          .send({ error: 'No campaign was found with that id' });
      }

      const campaign = campaignQuery.rows[0];

      const campaignAccessCheckQuery = await app.pg.query(
        'SELECT COUNT(id) FROM campaign WHERE id = $1 AND creator_user_account_id = $2 OR id IN (SELECT campaign_id FROM character WHERE user_account_id = $2)',
        [campaign.id, currentUserId]
      );

      if (campaignAccessCheckQuery.rows.length === 0 && !currentUserAdmin) {
        const campaignAdminQuery = await app.pg.query(
          'SELECT id FROM campaign_admin WHERE campaign_id = $1, user_account_id = $2',
          [campaignId, currentUserId]
        );

        if (campaignAdminQuery.rows.length !== 1) {
          app.log.error(
            { userId: currentUserId, campaignId },
            'Unable to get campaign as user is not a part of it'
          );

          return res
            .code(401)
            .send({ error: 'You do not have access to view this campaign' });
        }
      }

      return res.code(200).send(campaign);
    }
  );

  app.post(
    '/',
    {
      schema: {
        body: z.strictObject({
          name: z.string().nonempty().nonoptional(),
          description: z.string().optional(),
        }),
      },
    },
    async (req, res) => {
      const campaign = req.body;
      const { id: userId } = req.userFromCookie!;

      const createCampaignQuery = await app.pg.query<{ id: UUID }>(
        'INSERT INTO campaign (name, description, creator_user_account_id) VALUES ($1, $2, $3) RETURNING id',
        [campaign.name, campaign.description, userId]
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

  app.put(
    '/:campaignId',
    {
      schema: {
        body: z.strictObject({
          name: z.string().nonempty().nonoptional(),
          description: z.string().optional(),
          story: z.string().optional(),
          icon: z.url().optional(),
        }),
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const updatedCampaign = req.body;
      const { campaignId } = req.params;
      const { id: userId } = req.userFromCookie!;

      const viewCampaignQuery = await app.pg.query<{ count: number }>(
        'SELECT COUNT(id) FROM campaign WHERE creator_user_account_id = $1 AND id = $2',
        [userId, campaignId]
      );

      if (
        viewCampaignQuery.rows.length === 0 &&
        viewCampaignQuery.rows[0]?.count === 0
      ) {
        app.log.error(
          { userId: userId, campaignId },
          'Failed to update campaign as the user is not an admin in it or a system admin'
        );

        return res.code(401).send({
          error: 'You do not have admin access to modify this campaign',
        });
      }

      const updateCampaignQuery = await app.pg.query<{ id: UUID }>(
        'UPDATE campaign SET name = $1, description = $2, story = $3, icon = $4 WHERE id = $5 RETURNING id',
        [
          updatedCampaign.name,
          updatedCampaign.description,
          updatedCampaign.story,
          updatedCampaign.icon,
          campaignId,
        ]
      );

      if (updateCampaignQuery.rows.length !== 1) {
        app.log.error(
          updateCampaignQuery,
          `An error ocurred when updating campaign: ${campaignId}`
        );

        return res.code(500).send({ error: 'Failed to update campaign' });
      }

      return res.code(200).send({
        message: 'Successfully updated campaign',
        id: updateCampaignQuery.rows[0].id,
      });
    }
  );
};

export default campaignRoutes;

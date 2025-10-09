import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { Campaign, Character } from '../types/domain';

import { getUser } from '../plugins/retrieveData';

const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', getUser);

  app.get('/me', async (req, res) => {
    return res.code(200).send({ user: req.userFromCookie });
  });

  app.get('/me/campaigns', async (req, res) => {
    const { id: userId } = req.userFromCookie!;

    try {
      const getCampaignsQuery = await app.pg.query<Campaign>(
        'SELECT * FROM campaign WHERE id IN (SELECT campaign_id FROM character_template WHERE id IN (SELECT template_id FROM character WHERE user_account_id = $1))',
        [userId]
      );

      return res.code(200).send({ campaigns: getCampaignsQuery.rows });
    } catch (err) {
      app.log.error(
        { err, userId },
        "An error occurred while searching for a user's campaigns"
      );

      return res
        .code(500)
        .send({ message: 'Failed to search for your campaigns' });
    }
  });

  app.get(
    '/me/campaign/:campaignId/character',
    {
      schema: {
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { campaignId } = req.params;
      const { id: userId } = req.userFromCookie!;

      try {
        const getUserCharacterFromCampaignQuery = await app.pg.query<Character>(
          `
            SELECT
              *,
              resource_pools AS "resourcePools",
              created_date AS "createdDate",
              campaign_id AS "campaignId",
              template_id AS "templateId",
              user_account_id AS "userAccountId"
            FROM character
            WHERE campaign_id = $1 AND user_account_id = $2
          `,
          [campaignId, userId]
        );

        if (getUserCharacterFromCampaignQuery.rows.length === 0) {
          return res.code(404).send({
            message: 'No character found for your user on the campaign',
          });
        } else if (getUserCharacterFromCampaignQuery.rows.length > 1) {
          app.log.error(
            { userId, campaignId },
            'More than one character was found for a single user on a single campaign'
          );
        }

        return res.code(200).send(getUserCharacterFromCampaignQuery.rows[0]);
      } catch (err) {
        app.log.error(
          { err, userId, campaignId },
          "An error occurred while searching for a user's character on a campaign"
        );

        return res
          .code(500)
          .send({ message: 'Failed to search for your campaigns' });
      }
    }
  );
};

export default usersRoutes;

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { Campaign } from '../types/domain';

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
        err,
        "An error occurred while searching for a user's campaigns"
      );

      return res
        .code(500)
        .send({ message: 'Failed to search for your campaigns' });
    }
  });
};

export default usersRoutes;

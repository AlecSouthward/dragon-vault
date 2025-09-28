import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { getUser } from '../plugins/retrieveData';

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
    } catch (error) {
      app.log.error(
        { error },
        "An error occurred while searching for a user's campaigns"
      );

      return res
        .code(500)
        .send({ error: 'Failed to search for your campaigns' });
    }
  });
};

export default usersRoutes;

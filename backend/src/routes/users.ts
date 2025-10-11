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
      const campaigns = await app.db
        .selectFrom('campaign as c')
        .innerJoin('characterTemplate as ct', 'ct.campaignId', 'c.id')
        .innerJoin('character as ch', 'ch.templateId', 'ct.id')
        .selectAll('c')
        .where('ch.userAccountId', '=', userId)
        .distinct()
        .execute();

      return res.code(200).send({ campaigns: campaigns });
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
        const characters = await app.db
          .selectFrom('character')
          .select([
            'id',
            'name',
            'resourcePools',
            'createdDate',
            'campaignId',
            'templateId',
            'userAccountId',
          ])
          .where('campaignId', '=', campaignId)
          .where('userAccountId', '=', userId)
          .execute();

        if (characters.length === 0) {
          return res.code(404).send({
            message: 'No character found for your user on the campaign',
          });
        } else if (characters.length > 1) {
          app.log.error(
            { userId, campaignId },
            'More than one character was found for a single user on a single campaign'
          );
        }

        return res.code(200).send(characters[0]);
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

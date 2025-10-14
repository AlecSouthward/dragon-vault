import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';

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

      const campaign = await app.db
        .selectFrom('campaign')
        .selectAll()
        .where('id', '=', campaignId)
        .executeTakeFirst();

      if (!campaign) {
        app.log.error(
          { campaignId },
          'No campaign was found when fetching from id'
        );

        return res
          .code(StatusCodes.NOT_FOUND)
          .send({ message: 'No campaign was found with that id' });
      }

      const campaignAccessCheck = await app.db
        .selectFrom('campaign as c')
        .innerJoin('character as ch', 'ch.campaignId', 'c.id')
        .select('c.id')
        .where((eb) =>
          eb.or([
            eb.and([
              eb('c.id', '=', campaignId),
              eb('c.creatorUserAccountId', '=', currentUserId),
            ]),
            eb(
              'c.id',
              'in',
              eb
                .selectFrom('character')
                .select('ch.campaignId')
                .where('ch.userAccountId', '=', currentUserId)
            ),
          ])
        )
        .executeTakeFirst();

      if (!campaignAccessCheck && !currentUserAdmin) {
        const campaignAdminCheck = await app.db
          .selectFrom('campaignAdmin')
          .select('id')
          .executeTakeFirst();

        if (!campaignAdminCheck) {
          app.log.error(
            { userId: currentUserId, campaignId },
            'Unable to get campaign as user is not a part of it'
          );

          return res
            .code(StatusCodes.UNAUTHORIZED)
            .send({ message: 'You do not have access to view this campaign' });
        }
      }

      return res.code(StatusCodes.OK).send(campaign);
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
      const campaignToCreate = req.body;
      const { id: userId } = req.userFromCookie!;

      let newCampaignId;
      try {
        newCampaignId = await app.db
          .insertInto('campaign')
          .values({ ...campaignToCreate, creatorUserAccountId: userId })
          .returning('id')
          .executeTakeFirstOrThrow();
      } catch (err) {
        app.log.error(err, 'An error occurred when creating a new campaign');
        return res
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: 'Failed to create campaign' });
      }

      return res
        .code(StatusCodes.CREATED)
        .send({
          message: 'Successfully created campaign',
          id: newCampaignId.id,
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

      const campaign = await app.db
        .selectFrom('campaign')
        .select(['id', 'creatorUserAccountId'])
        .where('id', '=', campaignId)
        .executeTakeFirst();

      if (!campaign) {
        app.log.error(
          { userId: userId, campaignId },
          'Failed to update campaign as it does not exist'
        );

        return res
          .code(StatusCodes.NOT_FOUND)
          .send({ message: 'No campaign was found with that id' });
      }
      if (campaign.creatorUserAccountId === userId) {
        app.log.error(
          { userId: userId, campaignId },
          'Failed to update campaign as the user is not an admin in it or a system admin'
        );

        return res
          .code(StatusCodes.UNAUTHORIZED)
          .send({
            message: 'You do not have admin access to modify this campaign',
          });
      }

      try {
        await app.db
          .updateTable('campaign')
          .set(updatedCampaign)
          .where('id', '=', campaignId)
          .execute();
      } catch (err) {
        app.log.error(
          { err, campaignId },
          'An error occurred when updating campaign'
        );

        return res
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: 'Failed to update campaign' });
      }

      return res
        .code(StatusCodes.OK)
        .send({ message: 'Successfully updated campaign' });
    }
  );
};

export default campaignRoutes;

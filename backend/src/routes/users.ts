import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { uuidv7 } from 'uuidv7';
import z from 'zod';

import { getUser } from '../plugins/retrieveData';

import { IMAGE_FOLDERS } from '../utils/imageFolders';
import { compressImage, saveImage } from '../utils/images';

const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', getUser);

  app.get('/me', async (req, res) => {
    return res.send({ user: req.userFromCookie });
  });

  app.post(
    '/me/display-name',
    {
      schema: {
        body: z.strictObject({
          displayName: z.string().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { id: userId } = req.userFromCookie!;
      const { displayName: newDisplayName } = req.body;

      await app.db
        .updateTable('userAccount')
        .set('displayName', newDisplayName)
        .where('id', '=', userId)
        .executeTakeFirstOrThrow();

      return res.send();
    }
  );

  app.get('/me/campaigns', async (req, res) => {
    const { id: userId } = req.userFromCookie!;

    try {
      // TODO: Fix character queries using user creator id
      const campaigns = await app.db
        .selectFrom('campaign as c')
        .innerJoin('characterTemplate as ct', 'ct.campaignId', 'c.id')
        .leftJoin('character as ch', 'ch.templateId', 'ct.id')
        .selectAll('c')
        .where((eb) =>
          eb.or([
            eb('c.creatorUserAccountId', '=', userId),
            // eb('ch.userAccountId', '=', userId),
          ])
        )
        .distinct()
        .execute();

      return res.send({ campaigns });
    } catch (err) {
      app.log.error(
        { err, userId },
        "An error occurred while searching for a user's campaigns"
      );

      return res.internalServerError();
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
      // TODO: Fix character queries using user creator id
      // const { id: userId } = req.userFromCookie!;

      const character = await app.db
        .selectFrom('character')
        .select([
          'id',
          'name',
          'resourcePools',
          'createdDate',
          'campaignId',
          'templateId',
          // 'userAccountId',
        ])
        .where('campaignId', '=', campaignId)
        // .where('userAccountId', '=', userId)
        .executeTakeFirstOrThrow();

      return res.send(character);
    }
  );

  app.post('/me/profile-picture', async (req, res) => {
    const filePart = await req.file();

    if (!filePart) {
      return res.badRequest();
    }

    const { mimetype } = filePart;

    if (!mimetype.startsWith('image/')) {
      return res.badRequest();
    }

    const file = await compressImage(filePart);
    await saveImage(file, uuidv7(), IMAGE_FOLDERS.PROFILE_PICTURE);
  });
};

export default usersRoutes;

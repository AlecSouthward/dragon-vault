import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
import { uuidv7 } from 'uuidv7';
import z from 'zod';

import { getUser } from '../plugins/retrieveData';

import { IMAGE_FOLDERS } from '../utils/imageFolders';
import { compressImage, saveImage } from '../utils/images';

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

      return res.code(StatusCodes.OK).send({ campaigns: campaigns });
    } catch (err) {
      app.log.error(
        { err, userId },
        "An error occurred while searching for a user's campaigns"
      );

      return res
        .code(StatusCodes.INTERNAL_SERVER_ERROR)
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
        const character = await app.db
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
          .executeTakeFirst();

        if (!character) {
          app.log.error(
            { userId, campaignId },
            'Failed to find character on a campaign for user'
          );

          return res
            .code(StatusCodes.NOT_FOUND)
            .send({
              message: 'No character found for your user on the campaign',
            });
        }

        return res.code(StatusCodes.OK).send(character);
      } catch (err) {
        app.log.error(
          { err, userId, campaignId },
          "An error occurred while searching for a user's character on a campaign"
        );

        return res
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: 'Failed to search for your campaigns' });
      }
    }
  );

  app.post('/me/profile-picture', async (req, res) => {
    const filePart = await req.file();

    if (!filePart) {
      return res
        .code(StatusCodes.BAD_REQUEST)
        .send({ message: 'No profile picture was provided' });
    }

    const { mimetype } = filePart;

    if (!mimetype.startsWith('image/')) {
      return res
        .code(StatusCodes.BAD_REQUEST)
        .send({ error: 'File uploaded was not an image' });
    }

    const file = await compressImage(filePart);
    await saveImage(file, uuidv7(), IMAGE_FOLDERS.PROFILE_PICTURE);

    return res
      .code(StatusCodes.OK)
      .send({ message: 'Successfully set new profile picture' });
  });
};

export default usersRoutes;

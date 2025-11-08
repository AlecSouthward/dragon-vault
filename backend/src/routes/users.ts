import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { uuidv7 } from 'uuidv7';
import z from 'zod';

import { IMAGE_FOLDERS } from '../config/imageFolders';

import { getUser } from '../plugins/retrieveData';

import { throwDragonVaultError } from '../utils/error';
import { convertFromHstore } from '../utils/hstore';
import { compressImage, saveImage } from '../utils/images';

const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('preHandler', getUser);

  app.get('/me', async (req, res) => {
    const { password: _, ...displayUser } = req.userFromCookie!;

    return res.send({
      user: displayUser,
      message: 'Successfully retrieved your User Account.',
    });
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
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to update your display name.')
        );

      return res.send({ message: 'Successfully updated display name.' });
    }
  );

  app.get('/me/campaigns', async (req, res) => {
    const { id: userId } = req.userFromCookie!;

    const campaigns = await app.db
      .selectFrom('campaign as c')
      .leftJoin('characterTemplate as ct', 'ct.campaignId', 'c.id')
      .leftJoin('character as ch', 'ch.templateId', 'ct.id')
      .leftJoin('userCharacter as uch', 'uch.characterId', 'ch.id')
      .selectAll('c')
      .where((eb) =>
        eb.or([
          eb('c.creatorUserAccountId', '=', userId),
          eb('uch.userAccountId', '=', userId),
        ])
      )
      .distinct()
      .execute();

    return res.send({
      campaigns,
      message: 'Successfully retrieved your Campaigns.',
    });
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

      const existingCharacter = await app.db
        .selectFrom('character as c')
        .selectAll('c')
        .innerJoin('userCharacter as uch', 'uch.characterId', 'c.id')
        .where('uch.userAccountId', '=', userId)
        .where('c.campaignId', '=', campaignId)
        .executeTakeFirst();

      if (!existingCharacter) {
        return res.notFound('No Character was found on that Campaign.');
      }

      const { abilities, stats, resourcePools, ...userCharacter } =
        existingCharacter;

      if (!abilities || !stats || !resourcePools) {
        return res.internalServerError(
          'The Character has missing fields and is unable to be retrieved.'
        );
      }

      return res.send({
        character: {
          ...userCharacter,
          abilities: convertFromHstore(abilities),
          stats: convertFromHstore(stats),
          resourcePools: convertFromHstore(resourcePools),
        },
        message: 'Successfully retrieved your Character on the Campaign.',
      });
    }
  );

  app.post('/me/profile-picture', async (req, res) => {
    const filePart = await req.file();

    if (!filePart) {
      return res.badRequest('No profile picture was provided.');
    }

    const { mimetype } = filePart;

    if (!mimetype.startsWith('image/')) {
      return res.badRequest('Invalid profile picture was provided.');
    }

    const file = await compressImage(filePart);
    await saveImage(file, uuidv7(), IMAGE_FOLDERS.PROFILE_PICTURE);

    return res.send({ message: 'Successfully updated your profile picture.' });
  });
};

export default usersRoutes;

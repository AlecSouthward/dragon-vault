import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import {
  AbilityScoreTemplateFieldSchema,
  ResourcePoolTemplateFieldSchema,
  StatFieldTemplateSchema,
} from '../types/characterTemplateFieldValue';

import { getUser } from '../plugins/retrieveData';

import { checkUserCampaignAccess } from '../utils/campaigns';
import { throwDragonVaultError } from '../utils/error';

const RETRIEVE_FAIL = 'Failed to retrieve/authorize User for Campaign.';

const campaignRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', getUser);

  app.get(
    '/:campaignId',
    {
      schema: {
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { campaignId } = req.params;
      const { id: userId, admin: currentUserAdmin } = req.userFromCookie!;

      let campaign;
      try {
        campaign = await checkUserCampaignAccess(
          campaignId,
          userId,
          currentUserAdmin
        );
      } catch (err) {
        app.log.error(err, RETRIEVE_FAIL);

        return res.forbidden('You are not authorized to view this Campaign.');
      }

      return res.send({
        campaign,
        message: 'Successfully retrieved Campaign.',
      });
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

      const newCampaignId = await app.db
        .insertInto('campaign')
        .values({ ...campaignToCreate, creatorUserAccountId: userId })
        .returning('id')
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to create Campaign.')
        );

      return res.send({
        id: newCampaignId.id,
        message: 'Successfully created a new Campaign.',
      });
    }
  );

  app.put(
    '/:campaignId',
    {
      schema: {
        body: z.strictObject({
          name: z.string().nonempty(),
          description: z.string(),
          story: z.string(),
          icon: z.url(),
        }),
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const updatedCampaign = req.body;
      const { campaignId } = req.params;
      const { id: userId, admin: currentUserAdmin } = req.userFromCookie!;

      try {
        await checkUserCampaignAccess(campaignId, userId, currentUserAdmin);
      } catch (err) {
        app.log.error(err, RETRIEVE_FAIL);

        return res.forbidden(
          'Failed to authorize your User to allow editing this Campaign.'
        );
      }

      await app.db
        .updateTable('campaign')
        .set(updatedCampaign)
        .where('id', '=', campaignId)
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to update Campaign.')
        );

      return res.send({ message: 'Successfully updated Campaign.' });
    }
  );

  app.get(
    '/:campaignId/character-template',
    {
      schema: {
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { campaignId } = req.params;
      const { id: userId, admin: currentUserAdmin } = req.userFromCookie!;

      try {
        await checkUserCampaignAccess(campaignId, userId, currentUserAdmin);
      } catch (err) {
        app.log.error(err, RETRIEVE_FAIL);

        return res.forbidden(
          "Failed to authorize your User to allow viewing this Campaign's Character Template."
        );
      }

      const template = await app.db
        .selectFrom('characterTemplate')
        .selectAll()
        .where('campaignId', '=', campaignId)
        .executeTakeFirst();

      if (!template) {
        return res.notFound(
          'No Character Template was found for the Campaign.'
        );
      }

      return res.send({
        template,
        message: 'Successfully retrieved Character Template.',
      });
    }
  );

  app.post(
    '/:campaignId/character-template',
    {
      schema: {
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
        body: z.strictObject({
          abilities: z.record(z.string(), AbilityScoreTemplateFieldSchema),
          stats: z.record(z.string(), StatFieldTemplateSchema),
          resourcePools: z.record(z.string(), ResourcePoolTemplateFieldSchema),
        }),
      },
    },
    async (req, res) => {
      const { campaignId } = req.params;
      const { id: userId, admin: currentUserAdmin } = req.userFromCookie!;
      const characterTemplateToCreate = req.body;

      try {
        await checkUserCampaignAccess(campaignId, userId, currentUserAdmin);
      } catch (err) {
        app.log.error(err, RETRIEVE_FAIL);

        return res.forbidden(
          "Failed to authorize your User to allow editing this Campaign's Character Template."
        );
      }

      const existingCharacterTemplate = await app.db
        .selectFrom('characterTemplate')
        .where('campaignId', '=', campaignId)
        .executeTakeFirst();

      if (existingCharacterTemplate) {
        return res.conflict('Template already exists for this campaign.');
      }

      const newCharacterTemplate = await app.db
        .insertInto('characterTemplate')
        .values({ ...characterTemplateToCreate, campaignId })
        .returning('id')
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to update Character Template.')
        );

      return res.send({
        id: newCharacterTemplate.id,
        message: 'Successfully created Character Template.',
      });
    }
  );
};

export default campaignRoutes;

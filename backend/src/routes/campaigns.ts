import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import {
  AbilityScoreField,
  AbilityScoreFieldSchema,
  ResourcePoolField,
  ResourcePoolFieldSchema,
  StatField,
  StatFieldSchema,
} from '../types/characterFieldValue';

import { getUser } from '../plugins/retrieveData';

import { throwDragonVaultError } from '../utils/error';
import { convertFromHstore, convertToHstore } from '../utils/hstore';

const UNAUTHORIZED_VIEW_MESSAGE =
  'You are not authorized to view this Campaign.';

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
      const { id: currentUserId, admin: currentUserAdmin } =
        req.userFromCookie!;

      const campaign = await app.db
        .selectFrom('campaign')
        .selectAll()
        .where('id', '=', campaignId)
        .executeTakeFirst();

      if (!campaign) {
        return res.notFound('No Campaign was found.');
      }

      const campaignAccessCheck = await app.db
        .selectFrom('campaign as c')
        .leftJoin('character as ch', 'ch.campaignId', 'c.id')
        .distinct()
        .select('c.id')
        .where((eb) =>
          eb.or([
            eb.and([
              eb('c.id', '=', campaignId),
              eb('c.creatorUserAccountId', '=', currentUserId),
            ]),
            eb(
              'ch.id',
              'in',
              eb
                .selectFrom('userCharacter as uch')
                .select('uch.characterId')
                .where('uch.userAccountId', '=', currentUserId)
            ),
          ])
        )
        .executeTakeFirst();

      if (!campaign) {
        return res.notFound(UNAUTHORIZED_VIEW_MESSAGE);
      }

      if (!campaignAccessCheck && !currentUserAdmin) {
        const campaignAdminCheck = await app.db
          .selectFrom('campaignAdmin')
          .select('id')
          .executeTakeFirst();

        if (!campaignAdminCheck) {
          return res.unauthorized(UNAUTHORIZED_VIEW_MESSAGE);
        }
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
        return res.notFound('No Campaign was found to update.');
      } else if (campaign.creatorUserAccountId !== userId) {
        return res.unauthorized(
          'You are not authorized to modify the Campaign.'
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
          abilities: z.record(z.string(), AbilityScoreFieldSchema),
          stats: z.record(z.string(), StatFieldSchema),
          resourcePools: z.record(z.string(), ResourcePoolFieldSchema),
        }),
      },
    },
    async (req, res) => {
      const { campaignId } = req.params;
      const characterTemplateToCreate = req.body;

      const existingCharacterTemplate = await app.db
        .selectFrom('characterTemplate')
        .where('campaignId', '=', campaignId)
        .executeTakeFirst();

      if (existingCharacterTemplate) {
        return res.conflict('Template already exists for this campaign.');
      }

      const newCharacterTemplate = await app.db
        .insertInto('characterTemplate')
        .values({ ...(characterTemplateToCreate as object), campaignId })
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

  app.post(
    '/:campaignId/character',
    {
      schema: {
        body: z.strictObject({
          name: z.string().nonempty().nonoptional(),
          description: z.string().nonempty().optional(),
        }),
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { id: userId } = req.userFromCookie!;
      const { campaignId } = req.params;
      const characterToCreate = req.body;

      const existingCharacter = await app.db
        .selectFrom('character as ch')
        .selectAll()
        .leftJoin('userCharacter as uch', 'uch.characterId', 'ch.id')
        .executeTakeFirst();

      if (existingCharacter) {
        return res.conflict('Your Character already exists for this Campaign.');
      }

      const sourceCampaign = await app.db
        .selectFrom('campaign')
        .selectAll()
        .where('id', '=', campaignId)
        .executeTakeFirst();

      if (!sourceCampaign) {
        return res.notFound('No Campaign was found.');
      }

      const sourceCharacterTemplate = await app.db
        .selectFrom('characterTemplate')
        .selectAll()
        .where('campaignId', '=', campaignId)
        .executeTakeFirst();

      if (!sourceCharacterTemplate) {
        return res.notFound(
          'No Character Template was found for the Campaign. Unable to create a Character without a template.'
        );
      }

      const sourceStats = sourceCharacterTemplate.stats as Record<
        string,
        StatField
      >;
      const characterStats: Record<string, number> = Object.fromEntries(
        Object.keys(sourceStats).map((k) => [k, Math.round(Math.random() * 20)])
      );
      const hstoreStats = convertToHstore(characterStats);

      const sourceAbilities = sourceCharacterTemplate.abilities as Record<
        string,
        AbilityScoreField
      >;
      const characterAbilityScores: Record<string, number> = Object.fromEntries(
        Object.keys(sourceAbilities).map((k) => [
          k,
          Math.round(Math.random() * 20),
        ])
      );
      const hstoreAbilities = convertToHstore(characterAbilityScores);

      const sourceResourcePools =
        sourceCharacterTemplate.resourcePools as Record<
          string,
          ResourcePoolField
        >;
      const characterResourcePools: Record<string, number> = Object.fromEntries(
        Object.keys(sourceResourcePools).map((k) => [
          k,
          Math.round(Math.random() * 20),
        ])
      );
      const hstoreResourcePools = convertToHstore(characterResourcePools);

      const { id: newCharacterId } = await app.db
        .insertInto('character')
        .values({
          name: characterToCreate.name,
          description: characterToCreate.description,
          abilities: hstoreAbilities,
          stats: hstoreStats,
          resourcePools: hstoreResourcePools,
          campaignId: sourceCampaign.id,
          templateId: sourceCharacterTemplate.id,
        })
        .returning('id')
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to create Character.')
        );

      await app.db
        .insertInto('userCharacter')
        .values({ characterId: newCharacterId, userAccountId: userId })
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to create Character.')
        );

      return res.send({
        id: newCharacterId,
        message: 'Successfully created Character.',
      });
    }
  );
};

export default campaignRoutes;

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import {
  AbilityScoreField,
  ResourcePoolField,
  StatField,
} from '../types/characterFieldValue';

import { getUser } from '../plugins/retrieveData';

import { throwDragonVaultError } from '../utils/error';
import { convertFromHstore, convertToHstore } from '../utils/hstore';

const campaignCharactersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', getUser);

  app.get(
    '/:characterId',
    {
      schema: {
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty().nonoptional(),
          characterId: z.uuidv7().nonempty().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { campaignId, characterId } = req.params;

      const existingCharacter = await app.db
        .selectFrom('character')
        .selectAll()
        .where('id', '=', characterId)
        .where('campaignId', '=', campaignId)
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
        message: 'Successfully retrieved the Character on that Campaign.',
      });
    }
  );

  app.post(
    '/',
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
        Object.keys(sourceStats).map((k) => [k, Math.round(Math.random() * 20)]) // TODO: Add proper value defaults
      );
      const hstoreStats = convertToHstore(characterStats);

      const sourceAbilities = sourceCharacterTemplate.abilities as Record<
        string,
        AbilityScoreField
      >;
      const characterAbilityScores: Record<string, number> = Object.fromEntries(
        Object.keys(sourceAbilities).map((k) => [
          k,
          Math.round(Math.random() * 20), // TODO: Add proper value defaults
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
          Math.round(Math.random() * 20), // TODO: Add proper value defaults
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

  app.put(
    '/:characterId',
    {
      schema: {
        body: z.strictObject({
          name: z.string().nonempty(),
          description: z.string().nonempty(),
          stats: z.record(z.string(), z.number().int().positive()),
          abilities: z.record(z.string(), z.number().int().positive()),
          resourcePools: z.record(z.string(), z.number().int().positive()),
        }),
        params: z.strictObject({
          campaignId: z.uuidv7().nonempty(),
          characterId: z.uuidv7().nonempty(),
        }),
      },
    },
    async (req, res) => {
      const { campaignId, characterId } = req.params;
      const characterToUpdate = req.body;

      const existingCharacter = await app.db
        .selectFrom('character')
        .select('id')
        .where('id', '=', characterId)
        .executeTakeFirst();

      if (!existingCharacter) {
        return res.notFound('No Character was found to update.');
      }

      const sourceCharacterTemplate = await app.db
        .selectFrom('characterTemplate')
        .selectAll()
        .where('campaignId', '=', campaignId)
        .executeTakeFirst();

      if (!sourceCharacterTemplate) {
        return res.notFound(
          'No Character Template was found for the Campaign. Unable to update Character without a template.'
        );
      }

      const hstoreStats = convertToHstore(characterToUpdate.stats);
      const hstoreAbilities = convertToHstore(characterToUpdate.abilities);
      const hstoreResourcePools = convertToHstore(
        characterToUpdate.resourcePools
      );

      await app.db
        .updateTable('character')
        .set({
          name: characterToUpdate.name,
          description: characterToUpdate.description,
          abilities: hstoreAbilities,
          stats: hstoreStats,
          resourcePools: hstoreResourcePools,
        })
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to update Character.')
        );

      return res.send({ message: 'Successfully updated Character.' });
    }
  );
};

export default campaignCharactersRoutes;

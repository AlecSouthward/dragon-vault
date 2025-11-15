import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { ResourcePoolFieldSchema } from '../types/characterFieldValue';
import {
  AbilityScoreTemplateField,
  ResourcePoolTemplateField,
  StatTemplateField,
} from '../types/characterTemplateFieldValue';

import { getUser } from '../plugins/retrieveData';

import {
  formatPairField,
  validateResourcePoolFields,
} from '../utils/characterTemplate';
import { throwDragonVaultError } from '../utils/error';

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
        character: { ...userCharacter, abilities, stats, resourcePools },
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
          stats: z.record(z.string().nonempty(), z.number().int().positive()),
          abilities: z.record(
            z.string().nonempty(),
            z.number().int().positive()
          ),
          resourcePools: z.record(
            z.string().nonempty(),
            ResourcePoolFieldSchema
          ),
        }),
        params: z.strictObject({ campaignId: z.uuidv7().nonempty() }),
        querystring: z.strictObject({
          userAccountId: z.uuidv7().nonempty().optional(),
        }),
      },
    },
    async (req, res) => {
      const { id: currentUserId } = req.userFromCookie!;
      const { campaignId } = req.params;
      const { userAccountId: specifiedUserId } = req.query;
      const characterToCreate = req.body;

      const sourceCampaign = await app.db
        .selectFrom('campaign')
        .selectAll()
        .where('id', '=', campaignId)
        .executeTakeFirst();

      if (!sourceCampaign) {
        return res.notFound('No Campaign was found.');
      }

      const existingCharacter = await app.db
        .selectFrom('character as ch')
        .selectAll()
        .leftJoin('userCharacter as uch', 'uch.characterId', 'ch.id')
        .executeTakeFirst();

      if (existingCharacter) {
        return res.conflict('Your Character already exists for this Campaign.');
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

      const { stats, abilities, resourcePools, ...characterToCreateData } =
        characterToCreate;
      const {
        stats: templateStats,
        abilities: templateAbilities,
        resourcePools: templateResourcePools,
      } = sourceCharacterTemplate;

      const cleanStats = formatPairField(
        templateStats as StatTemplateField[],
        stats
      );
      const cleanAbilities = formatPairField(
        templateAbilities as AbilityScoreTemplateField[],
        abilities
      );

      validateResourcePoolFields(
        templateResourcePools as Record<string, ResourcePoolTemplateField>,
        resourcePools
      );

      const { id: newCharacterId } = await app.db
        .insertInto('character')
        .values({
          ...characterToCreateData,
          stats: cleanStats,
          abilities: cleanAbilities,
          resourcePools,
          campaignId: sourceCampaign.id,
          templateId: sourceCharacterTemplate.id,
        })
        .returning('id')
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to create Character.')
        );

      await app.db
        .insertInto('userCharacter')
        .values({
          characterId: newCharacterId,
          userAccountId: specifiedUserId ?? currentUserId,
        })
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
          resourcePools: z.record(
            z.string().nonempty(),
            ResourcePoolFieldSchema
          ),
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

      await app.db
        .updateTable('character')
        .set(characterToUpdate)
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to update Character.')
        );

      return res.send({ message: 'Successfully updated Character.' });
    }
  );
};

export default campaignCharactersRoutes;

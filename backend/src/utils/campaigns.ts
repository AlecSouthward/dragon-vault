import app from '../server';
import { DragonVaultError } from './error';

export const checkUserCampaignAccess = async (
  campaignId: string,
  userId: string,
  currentUserAdmin: boolean = false
) => {
  const campaign = await app.db
    .selectFrom('campaign')
    .selectAll()
    .where('id', '=', campaignId)
    .executeTakeFirst();

  if (!campaign) {
    throw new DragonVaultError('No Campaign was found.');
  }

  const campaignAccessCheck = await app.db
    .selectFrom('campaign as c')
    .distinct()
    .select('c.id')
    .where((eb) =>
      eb.or([
        eb.and([
          eb('c.id', '=', campaignId),
          eb('c.creatorUserAccountId', '=', userId),
        ]),
        eb(
          'c.id',
          '=',
          eb
            .selectFrom('character as ch')
            .innerJoin('userCharacter as uch', 'uch.characterId', 'c.id')
            .where('ch.campaignId', '=', campaignId)
            .select('ch.id')
            .limit(1)
        ),
        eb.exists(
          eb
            .selectFrom('campaignAdmin as ca')
            .where('ca.campaignId', '=', campaignId)
            .where('ca.userAccountId', '=', userId)
            .select('c.id')
        ),
        eb.exists(
          eb
            .selectFrom('campaignUser as cu')
            .select('cu.userAccountId')
            .where('cu.userAccountId', '=', userId)
        ),
      ])
    )
    .executeTakeFirst();

  if (!campaignAccessCheck && !currentUserAdmin) {
    throw new DragonVaultError('User is not authorized to view the Campaign.');
  }

  return campaign;
};

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { INVITE_EXPIRE_OFFSET_MS } from '../config/invites';

import { throwDragonVaultError } from '../utils/error';
import { createUser } from '../utils/user';

const inviteRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/:inviteId',
    {
      schema: {
        params: z.object({ inviteId: z.uuidv7() }),
        body: z.strictObject({
          username: z.string().nonoptional(),
          password: z.string().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { inviteId } = req.params;
      const { username, password } = req.body;

      const invite = await app.db
        .selectFrom('userInvite')
        .select(['createdDate', 'usedByUserAccountId'])
        .where('id', '=', inviteId)
        .executeTakeFirst();

      if (!invite) {
        return res.notFound('No User Invite was found.');
      }

      const expirationTime =
        invite.createdDate.getTime() + INVITE_EXPIRE_OFFSET_MS;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        return res.gone('The User Invite has expired.');
      } else if (invite.usedByUserAccountId) {
        return res.gone('The User Invite has already been used.');
      }

      const newUserId = await createUser(username, password);

      await app.db
        .updateTable('userInvite')
        .set('usedByUserAccountId', newUserId)
        .where('id', '=', inviteId)
        .executeTakeFirstOrThrow(
          throwDragonVaultError('Failed to mark User Invite as used.')
        );

      return res.send({
        message:
          'Successfully created a new User and consumed the User Invite.',
      });
    }
  );
};

export default inviteRoutes;

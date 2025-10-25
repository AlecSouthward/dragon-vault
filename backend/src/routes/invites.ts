import { httpErrors } from '@fastify/sensible';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { INVITE_EXPIRE_OFFSET_MS } from '../config/invites';

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
        app.log.error({ inviteId, username }, 'Failed to find invite by id');

        return res.notFound();
      }

      const expirationTime =
        invite.createdDate.getTime() + INVITE_EXPIRE_OFFSET_MS;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        app.log.error(
          { inviteId, username },
          'Failed to use invite as it has expired'
        );

        return res.gone();
      } else if (invite.usedByUserAccountId) {
        app.log.error(
          {
            inviteId,
            usedByUserAccountId: invite.usedByUserAccountId,
            username,
          },
          'Failed to use invite as it has already been used'
        );

        return res.gone();
      }

      const createUserResponse = await createUser(username, password);

      if (createUserResponse.errorHttpCode || !createUserResponse.newUserId) {
        app.log.error({ inviteId, username }, createUserResponse.error);

        return res.status(
          createUserResponse.errorHttpCode?.statusCode ??
            httpErrors.internalServerError().statusCode
        );
      }

      await app.db
        .updateTable('userInvite')
        .set('usedByUserAccountId', createUserResponse.newUserId)
        .where('id', '=', inviteId)
        .executeTakeFirstOrThrow();
    }
  );
};

export default inviteRoutes;

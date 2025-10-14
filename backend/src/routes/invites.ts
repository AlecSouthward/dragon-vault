import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
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

        return res
          .code(StatusCodes.NOT_FOUND)
          .send({ message: 'No invite was found with that id' });
      }

      const expirationTime =
        invite.createdDate.getTime() + INVITE_EXPIRE_OFFSET_MS;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        app.log.error(
          { inviteId, username },
          'Failed to use invite as it has expired'
        );

        return res
          .code(StatusCodes.GONE)
          .send({ message: 'The invite has expired' });
      } else if (invite.usedByUserAccountId) {
        app.log.error(
          {
            inviteId,
            usedByUserAccountId: invite.usedByUserAccountId,
            username,
          },
          'Failed to use invite as it has already been used'
        );

        return res
          .code(StatusCodes.GONE)
          .send({ message: 'The invite has already been used' });
      }

      const createUserResponse = await createUser(username, password);

      if (!createUserResponse.ok || !createUserResponse.newUserId) {
        app.log.error(
          { err: createUserResponse.error, inviteId, username },
          'An error occurred when creating a user from an invite'
        );

        return res
          .code(createUserResponse.httpCode)
          .send({ message: createUserResponse.error });
      }

      try {
        await app.db
          .updateTable('userInvite')
          .set('usedByUserAccountId', createUserResponse.newUserId)
          .where('id', '=', inviteId)
          .execute();
      } catch (err) {
        app.log.error(
          { err, inviteId, username },
          'An error occurred when using an invite'
        );

        return res
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: 'Failed to use the invite' });
      }

      return res
        .code(createUserResponse.httpCode)
        .send({ message: createUserResponse.message });
    }
  );
};

export default inviteRoutes;

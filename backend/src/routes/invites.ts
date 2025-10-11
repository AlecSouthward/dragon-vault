import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';

import { INVITE_EXPIRE_OFFSET_MS } from '../config/invites';

import { createUser } from '../utils/user';

const inviteRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.uuidv7(),
        }),
        body: z.strictObject({
          username: z.string().nonoptional(),
          password: z.string().nonoptional(),
        }),
      },
    },
    async (req, res) => {
      const { id: inviteId } = req.params;
      const { username, password } = req.body;

      try {
        const invites = await app.db
          .selectFrom('userInvite')
          .select(['createdDate', 'usedByUserAccountId'])
          .where('id', '=', inviteId)
          .execute();

        if (invites.length === 0) {
          return res
            .code(StatusCodes.NOT_FOUND)
            .send({ message: 'No invite was found with that id' });
        } else if (invites.length > 1) {
          app.log.error(
            { username, inviteId },
            'Multiple invites were returned from a single id, using the oldest one'
          );
        }

        const inviteToUse = invites[0];
        const expirationTime =
          inviteToUse.createdDate.getTime() + INVITE_EXPIRE_OFFSET_MS;
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
          return res
            .code(StatusCodes.GONE)
            .send({ message: 'The invite has expired' });
        } else if (inviteToUse.usedByUserAccountId) {
          return res
            .code(StatusCodes.GONE)
            .send({ message: 'The invite has already been used' });
        }

        const createUserResponse = await createUser(username, password);

        if (!createUserResponse.ok || !createUserResponse.newUserId) {
          app.log.error(
            { err: createUserResponse.error },
            'An error occurred when creating a user from an invite'
          );
          return res
            .code(createUserResponse.httpCode)
            .send({ message: createUserResponse.error });
        }

        await app.db
          .updateTable('userInvite')
          .set('usedByUserAccountId', createUserResponse.newUserId)
          .where('id', '=', inviteId)
          .execute();

        return res
          .code(createUserResponse.httpCode)
          .send({ message: createUserResponse.message });
      } catch (err) {
        app.log.error(err, 'An error occurred when using the invite');

        return res
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: 'Failed to use the invite' });
      }
    }
  );
};

export default inviteRoutes;

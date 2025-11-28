import { httpErrors } from '@fastify/sensible';

import app from '../server';
import { throwDragonVaultError } from './error';
import { hashPassword } from './passwordHash';

export const createUser = async (
  username: string,
  password: string
): Promise<string> => {
  const hashedPassword = await hashPassword(password);

  const existingUsername = await app.db
    .selectFrom('userAccount')
    .select('username')
    .where((eb) => eb('username', '=', username).and('deleted', '=', false))
    .executeTakeFirst();

  if (existingUsername) {
    throw httpErrors.conflict('That username is already taken.');
  }

  const newUser = await app.db
    .insertInto('userAccount')
    .values({ username, password: hashedPassword })
    .returning('id')
    .executeTakeFirstOrThrow(
      throwDragonVaultError('Failed to create a new User Account.')
    );

  return newUser.id;
};

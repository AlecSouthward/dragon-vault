import { HttpError, httpErrors } from '@fastify/sensible';
import { UUID } from 'node:crypto';

import { Cookie } from '../types/cookie';
import { SelectableUser } from '../types/domain';

import app from '../server';
import { hashPassword } from './passwordHash';

export const getUserFromCookie = async (
  cookie: Cookie
): Promise<SelectableUser | undefined> => {
  const user = await app.db
    .selectFrom('userAccount')
    .selectAll()
    .where('id', '=', cookie.id)
    .executeTakeFirst();

  return user;
};

export const createUser = async (
  username: string,
  password: string
): Promise<{
  ok: boolean;
  errorHttpCode?: HttpError;
  error?: string;
  newUserId?: UUID;
}> => {
  const hashedPassword = await hashPassword(password);

  try {
    const existingUsername = await app.db
      .selectFrom('userAccount')
      .select('username')
      .where('username', '=', username)
      .executeTakeFirstOrThrow();

    if (existingUsername) {
      return {
        ok: false,
        errorHttpCode: httpErrors.conflict(),
        error: 'That username is already taken',
      };
    }
  } catch (err) {
    app.log.error(
      { err, username },
      'An error occurred when checking for duplicate usernames'
    );

    return {
      ok: false,
      errorHttpCode: httpErrors.internalServerError(),
      error: 'Failed to check if the username is already taken',
    };
  }

  try {
    const newUserId = await app.db
      .insertInto('userAccount')
      .values({ username, password: hashedPassword })
      .returning('id')
      .executeTakeFirstOrThrow();

    return { ok: true, newUserId: newUserId.id as UUID };
  } catch (err) {
    app.log.error(
      { err, username },
      'An error occurred when creating a new user'
    );

    return { ok: false, error: 'Failed to create a new user' };
  }
};

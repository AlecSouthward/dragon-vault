import { StatusCodes } from 'http-status-codes';
import { UUID } from 'node:crypto';

import { Cookie } from '../types/cookie';
import { User } from '../types/domain';

import app from '../server';
import { hashPassword } from './passwordHash';

export const getUserFromCookie = async (
  cookie: Cookie
): Promise<User | undefined> => {
  const user = await app.db
    .selectFrom('userAccount')
    .select(['id', 'username', 'password', 'profilePicture', 'admin'])
    .where('id', '=', cookie.id)
    .executeTakeFirst();

  return user;
};

export const createUser = async (
  username: string,
  password: string
): Promise<{
  ok: boolean;
  httpCode: StatusCodes;
  message?: string;
  error?: string;
  newUserId?: UUID;
}> => {
  const hashedPassword = await hashPassword(password);

  try {
    const existingUsername = await app.db
      .selectFrom('userAccount')
      .select('username')
      .where('username', '=', username)
      .executeTakeFirst();

    if (existingUsername) {
      return {
        ok: false,
        httpCode: StatusCodes.CONFLICT,
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
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: 'Failed to check if the username is already taken',
    };
  }

  try {
    const newUserId = await app.db
      .insertInto('userAccount')
      .values({ username, password: hashedPassword })
      .returning('id')
      .executeTakeFirstOrThrow();

    return {
      ok: true,
      httpCode: StatusCodes.CREATED,
      message: `Created new user ${username}`,
      newUserId: newUserId.id as UUID,
    };
  } catch (err) {
    app.log.error(
      { err, username },
      'An error occurred when creating a new user'
    );

    return {
      ok: false,
      httpCode: StatusCodes.OK,
      error: 'Failed to create a new user',
    };
  }
};

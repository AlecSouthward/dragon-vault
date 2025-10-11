import { UUID } from 'node:crypto';

import { Cookie } from '../types/cookie';

import app from '../server';
import { hashPassword } from './passwordHash';

type UserFromCookie = {
  id: string;
  admin: boolean;
  username: string;
  password: string;
  profilePicture: string | null;
};

export const getUserFromCookie = async (
  cookie: Cookie
): Promise<UserFromCookie | null> => {
  const user = await app.db
    .selectFrom('userAccount')
    .select(['id', 'username', 'password', 'profilePicture', 'admin'])
    .where('id', '=', cookie.id)
    .executeTakeFirstOrThrow();

  if (!user) {
    return null;
  }

  return user;
};

export const createUser = async (
  username: string,
  password: string
): Promise<{
  ok: boolean;
  httpCode: number;
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
        httpCode: 409,
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
      httpCode: 500,
      error: 'Failed to check if the username is already taken',
    };
  }

  try {
    const newUserId = await app.db
      .insertInto('userAccount')
      .values({
        username,
        password: hashedPassword,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    return {
      ok: true,
      httpCode: 201,
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
      httpCode: 200,
      error: 'Failed to create a new user',
    };
  }
};

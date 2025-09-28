import { UUID } from 'node:crypto';

import { Cookie } from '../types/cookie';
import { User } from '../types/domain';

import app from '../server';
import { hashPassword } from './passwordHash';

export const getUserFromCookie = async (
  cookie: Cookie
): Promise<User | null> => {
  const userResult = await app.pg.query<User>(
    'SELECT id, username, password, profile_picture AS "profilePicture", is_admin as "isAdmin" FROM users WHERE id = $1',
    [cookie.id]
  );

  if (!userResult) {
    return null;
  } else if (userResult.rows.length > 1) {
    throw new Error('More than one user was returned from the cookie id');
  }

  return userResult.rows[0];
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
    const usernameExistsQuery = await app.pg.query(
      'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (usernameExistsQuery.rows.length > 0) {
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
    const createUserQuery = await app.pg.query<{ id: UUID }>(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    return {
      ok: true,
      httpCode: 201,
      message: `Created new user ${username}`,
      newUserId: createUserQuery.rows[0].id,
    };
  } catch (err) {
    app.log.error(
      { err, username },
      'An error occurred when creating a new user'
    );

    return { ok: false, httpCode: 500, error: 'Failed to create a new user' };
  }
};

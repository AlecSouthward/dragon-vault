import { FastifyReply } from 'fastify';

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
  res: FastifyReply,
  username: string,
  password: string
): Promise<FastifyReply> => {
  const hashedPassword = await hashPassword(password);

  try {
    const usernameExistsQuery = await app.pg.query(
      'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (usernameExistsQuery.rows.length > 0) {
      return res.code(409).send({ error: 'That username is already taken' });
    }
  } catch (error) {
    app.log.error(
      { error, username },
      'An error occurred when checking for duplicate usernames'
    );

    return res
      .code(500)
      .send({ error: 'Failed to check if the username is already taken' });
  }

  try {
    await app.pg.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
  } catch (error) {
    app.log.error(
      { error, username },
      'An error occurred when creating a new user'
    );

    return res.code(500).send({ error: 'Failed to create a new user' });
  }

  return res.code(201).send({ message: `Created new user ${username}` });
};

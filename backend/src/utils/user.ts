import { Cookie } from '../types/cookie';
import { User } from '../types/domain';

import app from '../server';

export const getUserFromCookie = async (
  cookie: Cookie
): Promise<User | null> => {
  const userResult = await app.pg.query<User>(
    'SELECT * FROM users WHERE id = $1',
    [cookie.id]
  );

  if (!userResult) {
    return null;
  } else if (userResult.rows.length > 1) {
    throw new Error('More than one user was returned from the cookie id');
  }

  return userResult.rows[0];
};

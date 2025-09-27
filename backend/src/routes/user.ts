import { FastifyPluginAsync } from 'fastify';

import { getUser } from '../plugins/retrieveData';

import { hashPassword } from '../utils/passwordHash';

const userRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', getUser);

  app.post('/create', async (req, res) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const hashedPassword = await hashPassword(password);

    try {
      const usernameExistsQuery = await app.pg.query(
        'SELECT * FROM users WHERE username = $1',
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
  });

  // TODO: Add routes for deleting/managing users
};

export default userRoutes;

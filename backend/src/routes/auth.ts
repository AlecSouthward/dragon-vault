import { FastifyPluginAsync } from 'fastify';

import { Cookie } from '../types/cookie.js';
import { User } from '../types/domain.js';

import { getUser } from '../plugins/retrieveData.js';

import { verifyPassword } from '../utils/passwordHash.js';

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', async (req, res) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const selectUserResult = await app.pg.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (selectUserResult === null) {
      res.code(500).send({ message: 'Failed to find user' });
    } else if (selectUserResult.rowCount === 0 || !selectUserResult.rowCount) {
      return res.code(401).send({ error: 'User not found' });
    } else if (selectUserResult.rowCount > 1) {
      return res.code(409).send({ error: 'More than one user found' });
    }

    const user: User = selectUserResult.rows[0];

    const passwordsMatch = await verifyPassword(password, user.password);
    if (!passwordsMatch)
      return res.status(401).send({ error: 'Invalid credentials' });

    const userCookie: Cookie = {
      id: user.id,
      username: user.username,
    };

    res.setCookie('token', app.jwt.sign(userCookie), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    res.send({ id: user.id, username: user.username, isAdmin: user.isAdmin });
  });

  app.get('/me', { preHandler: [getUser] }, async (req) => {
    return { user: req.userFromCookie };
  });
};

export default authRoutes;

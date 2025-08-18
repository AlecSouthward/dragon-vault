import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';

import { User } from '../types/domain.js';

export default function routes(app: FastifyInstance): void {
  app.post('/auth/login', async (req, res) => {
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

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch)
      return res.status(401).send({ error: 'Invalid credentials' });

    const token = app.jwt.sign({ id: user.id, username: user.username });
    res.setCookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    res.send({ id: user.id, username: user.username, isAdmin: user.isAdmin });
  });

  app.get('/me', { preHandler: [app.authenticate] }, async (req) => {
    return { user: req.user };
  });
}

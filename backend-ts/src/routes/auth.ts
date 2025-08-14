import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';

export default function routes(app: FastifyInstance): void {
  app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };

    // TODO: fetch user from DB

    const user = {
      id: '123',
      email,
      passwordHash: await bcrypt.hash('password', 10),
    };

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).send({ error: 'Invalid credentials' });

    const token = app.jwt.sign({ sub: user.id, email: user.email });
    res.setCookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return { ok: true };
  });

  app.get('/me', { preHandler: [app.authenticate] }, async (req) => {
    return { user: req.user };
  });
}

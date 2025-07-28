import { db } from "../db.js";
import bcrypt from "bcrypt";

export default async function (fastify) {
  fastify.post('/login', async (req, reply) => {
    const { username, password } = req.body;
    const res = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (!res.rows.length) return reply.code(401).send({ error: 'Invalid credentials' });

    const user = res.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return reply.code(401).send({ error: 'Invalid credentials' });

    const token = fastify.jwt.sign({ id: user.id, username: user.username });
    reply.send({ token });
  });

  fastify.post("/create", async (req, res) => {
    const { username } = req.body;

    const userId = Date.now().toString(36) + Math.random().toString(36).slice(2);

    return {
      id: userId
    };
  });
}
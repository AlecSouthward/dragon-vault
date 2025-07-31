import bcrypt from "bcrypt";

import { db } from "../db.js";

export default async function (fastify) {
  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body;
    const databaseResponse = await db.query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username]);

    if (!databaseResponse.rows.length) return reply.code(401).send({ error: "User not found" });

    const user = databaseResponse.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return reply.code(401).send({ error: "Invalid credentials" });

    const token = fastify.jwt.sign({ id: user.id, username: user.username });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/"
    });

    reply.send({ username: user.username, isAdmin: user.is_admin }); // Return profile picture, role, etc. later
  });

  fastify.post("/create", { preHandler: [fastify.authenticate] }, async (req, _res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    const userId = Date.now().toString(36) + Math.random().toString(36).slice(2);

    return {
      id: userId,
      username,
      password: passwordHash
    };
  });
}

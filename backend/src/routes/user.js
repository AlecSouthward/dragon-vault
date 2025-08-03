import bcrypt from "bcrypt";

import { database } from "../database.js";

export default async function (fastify) {
  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body;
    const databaseResult = await database.query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username]);

    if (databaseResult.rows.length === 0) {
      return reply.code(401).send({ error: "User not found" });
    }

    const user = databaseResult.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return reply.code(401).send({ error: "Invalid credentials" });

    const token = fastify.jwt.sign({ id: user.id, username: user.username, isAdmin: user.is_admin });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/"
    });

    reply.send({ username: user.username, isAdmin: user.is_admin }); // Return profile picture, role, etc. later
  });

  fastify.post("/logout", async (_req, res) => {
    res.clearCookie("token");
  });

  fastify.post("/create", { preHandler: [fastify.authenticate] }, async (req, res) => {
    const { username, password } = req.body;

    const usernameResult = await database.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)",
      [username]
    );
    
    if (usernameResult.rows[0].exists) {
      res.code(409).send({ message: "Username is taken" });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const databaseResult = await database.query(
      "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id",
      [username, passwordHash, false]
    );
    const userId = databaseResult.rows[0].id;

    return { userId };
  });

  fastify.get("/retrieve-all", { preHandler: [fastify.authenticate, fastify.adminValidation] }, async (_req, _res) => {
    const databaseResult = await database.query("SELECT id, username FROM users");
    const users = databaseResult.rows;

    return { users };
  });

  fastify.post("/set-admin", { preHandler: [fastify.authenticate, fastify.adminValidation] }, async (req, _res) => {
    const { id: userId } = req.body.user;

    await database.query(
      "UPDATE users SET is_admin = TRUE WHERE id = $1",
      [userId]
    );

    return { message: "Successfully set the user to be Admin" };
  });
}

import bcrypt from "bcrypt";

import { database } from "../database.js";

export default async function (fastify) {
  fastify.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const selectUserResult = await database.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (selectUserResult.rowCount === 0) {
      return res.code(401).send({ error: "User not found" });
    } else if (selectUserResult.rowCount > 1) {
      return res.code(409).send({ error: "More than one user was found" });
    }

    const user = selectUserResult.rows[0];

    // Validate the user's password against the saved password
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.code(401).send({ error: "Invalid credentials" });

    // Create a JWT auth token
    const token = fastify.jwt.sign({
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin,
    });

    // Set the auth token as a cookie on the user's browser
    res.setCookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });

    // Return profile picture, role, etc. later
    return res.send({ username: user.username, isAdmin: user.is_admin });
  });

  fastify.post("/logout", async (_req, res) => {
    res.clearCookie("token");
  });

  fastify.post(
    "/create",
    { preHandler: [fastify.authenticate] },
    async (req, res) => {
      const { username, password } = req.body;

      const usernameExistsResult = await database.query(
        "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)",
        [username]
      );

      if (usernameExistsResult.rows[0].exists) {
        return res.code(409).send({ message: "Username is taken" });
      }

      // Hash the user's password with 12 salt rounds (production ready)
      const passwordHash = await bcrypt.hash(password, 12);

      const userCreationResult = await database.query(
        "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id",
        [username, passwordHash, false]
      );
      const newUserId = userCreationResult.rows[0].id;

      return res.send({ userId: newUserId });
    }
  );

  fastify.get(
    "/retrieve-all",
    { preHandler: [fastify.authenticate, fastify.adminValidation] },
    async (_req, res) => {
      const retrieveUsersResult = await database.query(
        "SELECT id, username FROM users"
      );
      const users = retrieveUsersResult.rows;

      return res.send({ users });
    }
  );

  fastify.put(
    "/set-admin",
    { preHandler: [fastify.authenticate, fastify.adminValidation] },
    async (req, res) => {
      const { id: userId } = req.body.user;

      await database.query("UPDATE users SET is_admin = TRUE WHERE id = $1", [
        userId,
      ]);

      return res.send({ message: "Successfully set user to be admin" });
    }
  );
}

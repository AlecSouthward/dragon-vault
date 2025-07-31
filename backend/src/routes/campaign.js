import { db } from "../db.js";

export default async function (fastify) {
  fastify.get("/retrieve-for-user", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    const { id: userId } = req.user;

    const databaseResponse = await db.query("SELECT id, name FROM campaigns WHERE owner_id = $1", [userId]);

    reply.code(200).send({ campaigns: databaseResponse.rows });
  });
  
  fastify.post("/create", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    const { name } = req.body;
    const { id: userId } = req.user;

    await db.query("INSERT INTO campaigns (name, owner_id) VALUES ($1, $2)", [name, userId]);

    reply.code(200).send({ message: "Successfully created Campagin" });
  });
}

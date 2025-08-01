import { database } from "../database.js";

export default async function (fastify) {
  fastify.get("/retrieve-for-user", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    const { id: userId } = req.user;

    const databaseResult = await database.query("SELECT id, name FROM campaigns WHERE owner_id = $1", [userId]);

    reply.code(200).send({ campaigns: databaseResult.rows });
  });
  
  fastify.post("/create", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    const { name } = req.body;
    const { id: userId } = req.user;

    await database.query("INSERT INTO campaigns (name, owner_id) VALUES ($1, $2)", [name, userId]);

    reply.code(200).send({ message: "Successfully created Campagin" });
  });
}

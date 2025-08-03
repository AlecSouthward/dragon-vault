import { database } from "../database.js";

export default async function (fastify) {
  fastify.get("/retrieve-for-user/:userId", { preHandler: [fastify.authenticate, fastify.authenticateForCharacter] }, async (req, _res) => {
    reply.code(200).send({ character: req.character });
  });

  fastify.put("/update", { preHandler: [fastify.authenticate, fastify.authenticateForCharacter] }, async (req, _res) => {
    const {
      name,
      description,
      class: charClass,
      race,
      level,
      alive,
      health_bars,
      stats,
      skills
    } = req.character;
    
    const query = `
      UPDATE characters
      SET
        name = $1,
        description = $2,
        class = $3,
        race = $4,
        level = $5,
        alive = $6,
        health_bars = $7::jsonb,
        stats = $8::jsonb,
        skills = $9::jsonb
      WHERE id = $10
      RETURNING *;
    `;

    const values = [
      name,
      description,
      charClass,
      race,
      level,
      alive,
      JSON.stringify(health_bars),
      JSON.stringify(stats),
      JSON.stringify(skills),
      id
    ];
    
    await database.query(query, values);
  });
}
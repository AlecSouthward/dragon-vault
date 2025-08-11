import { FastifyInstance } from "fastify";

import { database } from "../database.js";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/retrieve-for-user/:userId",
    { preHandler: [fastify.authenticate, fastify.authenticateForCharacter] },
    async (req, res) => {
      return res.send({ character: req.character });
    }
  );

  fastify.put(
    "/update",
    { preHandler: [fastify.authenticate, fastify.authenticateForCharacter] },
    async (req, res) => {
      const {
        name,
        description,
        class: charClass,
        race,
        level,
        alive,
        healthBars,
        stats,
        skills,
        id,
      } = req.character;

      const characterUpdateQuery = `
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
        WHERE id = $10;
      `;

      const characterUpdateValues = [
        name,
        description,
        charClass,
        race,
        level,
        alive,
        JSON.stringify(healthBars),
        JSON.stringify(stats),
        JSON.stringify(skills),
        id,
      ];

      await database.query(characterUpdateQuery, characterUpdateValues);

      return res.send({ message: "Successfully updated Character" });
    }
  );
}

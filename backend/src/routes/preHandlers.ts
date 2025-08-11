import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

import { database } from "../database.js";

export default fp(async function preHandlers(fastify: FastifyInstance) {
  // Retrieves the user object off the token cookie
  fastify.decorate("authenticate", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const token = req.cookies.token; // grab from cookie

      if (!token) throw new Error("No token was provided");

      const decoded = fastify.jwt.verify(token);
      req.user = decoded;
    } catch (err) {
      return res.code(401).send(err);
    }
  });

  // Requires "authenticate" to be run, as this needs the user object from the cookie's token
  fastify.decorate("adminValidation", async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user; // Retrieved from "authenticate" preHandler

    if (!user?.isAdmin) {
      return res.status(401).send({ error: "Unauthorized" });
    }
  });

  // Requires "authenticate" to be run, as this needs the user object from the cookie's token
  fastify.decorate("authenticateForCampaign", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { campaign } = req.body;
      const user = req.user; // Retrieved from "authenticate" preHandler

      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      // Checks if the user's id matches the owner's user id for the campaign
      const userOwnsCampaign = await database.query(
        "SELECT EXISTS (SELECT 1 FROM campaigns WHERE owner_id = $1 AND id = $2 LIMIT 1)",
        [user.id, campaign.id]
      );

      if (!userOwnsCampaign) {
        return res.status(403).send({ error: "Not the owner of the campaign" });
      }

      req.campaign = campaign;
    } catch (err) {
      return res.code(500).send(err);
    }
  });

  // Requires "authenticate" to be run, as this needs the user object from the cookie's token
  fastify.decorate("authenticateForCharacter", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { character } = req.body;
      const user = req.user; // Retrieved from "authenticate" preHandler

      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      // Checks if the user's id matches the owner's user id for the character
      const userOwnsCampaign = await database.query(
        "SELECT EXISTS (SELECT 1 FROM characters WHERE owner_id = $1 AND id = $2 LIMIT 1)",
        [user.id, character.id]
      );

      if (!userOwnsCampaign) {
        return res
          .status(403)
          .send({ error: "Not the owner of the character" });
      }

      req.character = character;
    } catch (err) {
      return res.code(500).send(err);
    }
  });
});

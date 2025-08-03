import fp from "fastify-plugin";

export default fp(async function preHandlers(fastify) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const token = request.cookies.token; // grab from cookie
      const decoded = await fastify.jwt.verify(token);
      request.user = decoded;
    } catch (err) {
      reply.code(401).send(err);
    }
  });

  fastify.decorate("adminValidation", async (req, res) => {
    if (!req.user?.isAdmin) {
      res.status(401).send({ error: "Unauthorized" });
    }
  });

  fastify.decorate("authenticateForCampaign", async (request, reply) => {
    try {
      const { campaign } = request.body;
      const user = request.user;

      if (!user) {
        reply.status(401).send({ error: "Unauthorized" });

        return;
      }

      const userOwnsCampaign = await db.query(
        "SELECT EXISTS (SELECT 1 FROM campaigns WHERE owner_id = $1 AND id = $2 LIMIT 1)",
        [user.id, campaign.id]
      );

      if (!userOwnsCampaign) {
        reply.status(403).send({ error: "Not the owner of the campaign" });

        return;
      }

      request.campaign = campaign;
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate("authenticateForCharacter", async (request, reply) => {
    try {
      const { character } = request.body;
      const user = request.user;

      if (!user) {
        reply.status(401).send({ error: "Unauthorized" });

        return;
      }

      const userOwnsCampaign = await db.query(
        "SELECT EXISTS (SELECT 1 FROM characters WHERE owner_id = $1 AND id = $2 LIMIT 1)",
        [user.id, character.id]
      );

      if (!userOwnsCampaign) {
        reply.status(403).send({ error: "Not the owner of the character" });

        return;
      }

      request.character = character;
    } catch (err) {
      reply.send(err);
    }
  });
});

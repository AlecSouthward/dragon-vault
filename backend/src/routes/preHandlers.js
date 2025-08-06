import fp from "fastify-plugin";

export default fp(async function preHandlers(fastify) {
  // Retrieves the user object off the token cookie
  fastify.decorate("authenticate", async (request, res) => {
    try {
      const token = request.cookies.token; // grab from cookie
      const decoded = await fastify.jwt.verify(token);
      request.user = decoded;
    } catch (err) {
      return res.code(401).send(err);
    }
  });

  // Requires "authenticate" to be run, as this needs the user object from the cookie's token
  fastify.decorate("adminValidation", async (req, res) => {
    const user = req.user; // Retrieved from "authenticate" preHandler

    if (!user?.isAdmin) {
      return res.status(401).send({ error: "Unauthorized" });
    }
  });

  // Requires "authenticate" to be run, as this needs the user object from the cookie's token
  fastify.decorate("authenticateForCampaign", async (request, res) => {
    try {
      const { campaign } = request.body;
      const user = request.user; // Retrieved from "authenticate" preHandler

      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      // Checks if the user's id matches the owner's user id for the campaign
      const userOwnsCampaign = await db.query(
        "SELECT EXISTS (SELECT 1 FROM campaigns WHERE owner_id = $1 AND id = $2 LIMIT 1)",
        [user.id, campaign.id]
      );

      if (!userOwnsCampaign) {
        return res.status(403).send({ error: "Not the owner of the campaign" });
      }

      request.campaign = campaign;
    } catch (err) {
      return res.code(500).send(err);
    }
  });

  // Requires "authenticate" to be run, as this needs the user object from the cookie's token
  fastify.decorate("authenticateForCharacter", async (request, res) => {
    try {
      const { character } = request.body;
      const user = request.user; // Retrieved from "authenticate" preHandler

      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      // Checks if the user's id matches the owner's user id for the character
      const userOwnsCampaign = await db.query(
        "SELECT EXISTS (SELECT 1 FROM characters WHERE owner_id = $1 AND id = $2 LIMIT 1)",
        [user.id, character.id]
      );

      if (!userOwnsCampaign) {
        return res
          .status(403)
          .send({ error: "Not the owner of the character" });
      }

      request.character = character;
    } catch (err) {
      return res.code(500).send(err);
    }
  });
});

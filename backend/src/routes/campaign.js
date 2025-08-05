import { database } from "../database.js";

export default async function (fastify) {
  fastify.get(
    "/retrieve-all-for-user/:userId",
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
      const { userId } = req.params;

      // TODO: Adjust to select from created and user character campaigns
      const databaseResult = await database.query(
        "SELECT id, name FROM campaigns WHERE creator_user_id = $1",
        [userId]
      );

      reply.code(200).send({ campaigns: databaseResult.rows });
    }
  );

  fastify.get(
    "/retrieve-users/:campaignId",
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
      const { campaignId } = req.params;

      const databaseResult = await database.query(
        `
        SELECT users.id, users.username
        FROM characters
        JOIN users ON characters.user_id = users.id
        WHERE characters.campaign_id = $1
      `,
        [campaignId]
      );

      reply.code(200).send({ users: databaseResult.rows });
    }
  );

  fastify.post(
    "/create",
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
      const { name } = req.body;
      const { id: userId } = req.user;

      await database.query(
        "INSERT INTO campaigns (name, creator_user_id) VALUES ($1, $2)",
        [name, userId]
      );

      reply.code(200).send({ message: "Successfully created Campagin" });
    }
  );

  fastify.post(
    "/add-user",
    { preHandler: [fastify.authenticate, fastify.authenticateForCampaign] },
    async (req, reply) => {
      const { id: campaignId } = req.campaign;
      const { id: userId } = req.user;

      await database.query(
        "INSERT INTO characters (name, campaign_id, user_id) VALUES ($1, $2, $3)",
        ["Unnamed", userId, campaignId]
      );

      reply
        .code(200)
        .send({ message: "Successfully created a character for user" });
    }
  );

  fastify.post(
    "/add-admin",
    { preHandler: [fastify.authenticate, fastify.authenticateForCampaign] },
    async (req, reply) => {
      const { id: newAdminUserId } = req.body;
      const { id: campaignId } = req.campaignId;

      await database.query(
        "INSERT INTO campaign_admins (user_id, campaign_id) VALUES ($1, $2)",
        [newAdminUserId, campaignId]
      );

      reply
        .code(200)
        .send({
          message: "Successfully made the User and Admin in the Campaign",
        });
    }
  );
}

import { database } from "../database.js";

export default async function (fastify) {
  fastify.get(
    "/retrieve-all-for-user/:userId",
    { preHandler: [fastify.authenticate] },
    async (req, res) => {
      const { userId } = req.params;

      // TODO: Adjust to select from created and user character campaigns
      const retrieveUsersResult = await database.query(
        "SELECT id, name FROM campaigns WHERE creator_user_id = $1",
        [userId]
      );

      return res.send({ campaigns: retrieveUsersResult.rows });
    }
  );

  fastify.get(
    "/retrieve-users/:campaignId",
    { preHandler: [fastify.authenticate] },
    async (req, res) => {
      const { campaignId } = req.params;

      const retrieveUsersResult = await database.query(
        `
          SELECT users.id, users.username
          FROM characters
          JOIN users ON characters.user_id = users.id
          WHERE characters.campaign_id = $1
        `,
        [campaignId]
      );

      return res.send({ users: retrieveUsersResult.rows });
    }
  );

  fastify.post(
    "/create",
    { preHandler: [fastify.authenticate] },
    async (req, res) => {
      const { name } = req.body;
      const { id: userId } = req.user;

      await database.query(
        "INSERT INTO campaigns (name, creator_user_id) VALUES ($1, $2)",
        [name, userId]
      );

      return res.send({ message: "Successfully created Campaign" });
    }
  );

  // This route creates a character for a specific user, which adds them to the campaign
  fastify.post(
    "/add-user",
    { preHandler: [fastify.authenticate, fastify.authenticateForCampaign] },
    async (req, res) => {
      const { id: campaignId } = req.campaign;
      const { id: userId } = req.user;

      await database.query(
        "INSERT INTO characters (campaign_id, user_id) VALUES ($1, $2)",
        [userId, campaignId]
      );

      return res.send({ message: "Successfully created Character for user" });
    }
  );

  // Creates a new row in the campaign admins table for the user and campaign
  fastify.post(
    "/add-admin",
    { preHandler: [fastify.authenticate, fastify.authenticateForCampaign] },
    async (req, res) => {
      const { id: newAdminUserId } = req.body;
      const { id: campaignId } = req.campaignId;

      await database.query(
        "INSERT INTO campaign_admins (user_id, campaign_id) VALUES ($1, $2)",
        [newAdminUserId, campaignId]
      );

      return res.send({
        message: "Successfully set user to be admin in the Campaign",
      });
    }
  );
}

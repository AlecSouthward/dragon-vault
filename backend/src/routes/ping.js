export default async function (fastify) {
  // Route for validating the user's session
  // Returns data required for general requests and functionality of UI
  fastify.get(
    "/ping",
    { preHandler: [fastify.authenticate] },
    async (req, res) => {
      return res.send({
        message: "Session is valid",
        user: {
          username: req.user.username,
          isAdmin: req.user.isAdmin,
        },
      });
    }
  );
}

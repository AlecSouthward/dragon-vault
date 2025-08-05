export default async function (fastify) {
  fastify.get(
    "/ping",
    { preHandler: [fastify.authenticate] },
    async (req, res) => {
      res.code(200).send({
        message: "Session is valid",
        user: {
          username: req.user.username,
          isAdmin: req.user.isAdmin,
        },
      });
    }
  );
}

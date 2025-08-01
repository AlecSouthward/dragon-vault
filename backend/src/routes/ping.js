export default async function (fastify) {
  fastify.get("/ping", { preHandler: [fastify.authenticate] }, async (req, res) => {
    res.send(200).send({ message: "Session is valid",  user: req.user });
  });
}

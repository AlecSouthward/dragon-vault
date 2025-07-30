export default async function (fastify) {
  fastify.get("/ping", { preHandler: [fastify.authenticate] }, async (_req, res) => {
    res.send(200).send({ message: "Session is valid" });
  });
}

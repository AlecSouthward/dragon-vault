export default async function (fastify) {
  fastify.get("/retrieve-for-user", { preHandler: [fastify.authenticate, fastify.authenticateForCharacter] }, async (req, _res) => {
    reply.code(200).send({ character: req.character });
  });
}
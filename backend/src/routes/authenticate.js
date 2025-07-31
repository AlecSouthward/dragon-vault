import fp from "fastify-plugin";

export default fp(async function authenticate(fastify) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
        const token = request.cookies.token; // grab from cookie
        const decoded = await fastify.jwt.verify(token);
        request.user = decoded;
    } catch (err) {
      reply.send(err);
    }
  });
});

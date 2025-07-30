
export default async function authentication(fastify) {
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: "Unauthorized" });
        }
    });
}
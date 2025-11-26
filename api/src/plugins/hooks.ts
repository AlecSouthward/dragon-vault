import { type FastifyInstance } from 'fastify/types/instance';

const setupHooks = async (app: FastifyInstance) => {
  app.addHook('onRequest', async (req, res) => {
    res.header('X-Request-Id', req.id);
  });
};

export default setupHooks;

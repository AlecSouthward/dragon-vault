import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get('/', async (_, res) => {
    res.send({ healthy: true });
  });
};

export default healthRoutes;

import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';

const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get('/', async (_, res) => {
    res.code(StatusCodes.OK);
  });
};

export default healthRoutes;

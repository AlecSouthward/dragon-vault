import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { getUser } from '../plugins/retrieveData';

const campaignRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', getUser);

  // app.get('/')
};

export default campaignRoutes;

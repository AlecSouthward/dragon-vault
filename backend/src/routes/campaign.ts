import { FastifyPluginAsync } from 'fastify';

import { getUser } from '../plugins/retrieveData';

const campaignRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', getUser);

  // app.get('/')
};

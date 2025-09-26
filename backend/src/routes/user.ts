import { FastifyPluginAsync } from 'fastify';

import { getUser } from '../plugins/retrieveData';

const userRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', getUser);

  // TODO: Add routes for creating/deleting/managing users
};

export default userRoutes;

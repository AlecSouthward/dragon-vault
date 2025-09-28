import { FastifyPluginAsync } from 'fastify';

import adminUserRoutes from './admin/users';
import authRoutes from './auth';
import usersRoutes from './users';

const apiRoutes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(adminUserRoutes, { prefix: '/admin' });
  app.register(usersRoutes, { prefix: '/users' });
};

export default apiRoutes;

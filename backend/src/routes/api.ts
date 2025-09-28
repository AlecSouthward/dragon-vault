import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import adminInviteRoutes from './admin/invites';
import adminUserRoutes from './admin/users';
import authRoutes from './auth';
import usersRoutes from './users';

const apiRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(adminUserRoutes, { prefix: '/admin' });
  app.register(adminInviteRoutes, { prefix: '/admin' });
  app.register(usersRoutes, { prefix: '/users' });
};

export default apiRoutes;

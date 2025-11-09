import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import adminRoutes from './admin';
import authRoutes from './auth';
import campaignCharactersRoutes from './campaignCharacters';
import campaignRoutes from './campaigns';
import inviteRoutes from './invites';
import usersRoutes from './users';

const apiRoutes: FastifyPluginAsyncZod = async (app) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(adminRoutes, { prefix: '/admin' });
  app.register(campaignRoutes, { prefix: '/campaigns' });
  app.register(campaignCharactersRoutes, {
    prefix: '/campaigns/:campaignId/characters',
  });
  app.register(usersRoutes, { prefix: '/users' });
  app.register(inviteRoutes, { prefix: '/invites' });
};

export default apiRoutes;

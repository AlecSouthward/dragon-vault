import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransformers,
} from 'fastify-zod-openapi';

import ENV from '../env';

export const SWAGGER_PATH = '/documentation';

export default fp(async (app) => {
  await app.register(fastifyZodOpenApiPlugin);

  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Dragon Vault Swagger',
        description: 'Dragon Vault Swagger API Specification.',
        version: process.env.npm_package_version!,
        contact: {
          email: 'alec@asouth.dev',
          name: 'Alec Southward',
          url: 'https://asouthdev.co.za',
        },
        license: {
          name: 'GNU General Public License v3.0',
          identifier: 'GNU GPLv3',
          url: 'https://github.com/AlecSouthward/dragon-vault/blob/main/LICENSE',
        },
      },
      servers: [
        {
          url: 'http://localhost:' + ENV.PORT,
          description: 'Development Server',
        },
      ],
      tags: [{ name: 'default', description: 'All Dragon Vault endpoints.' }],
      components: {
        securitySchemes: {
          tokenAuthentication: {
            type: 'apiKey',
            name: 'token',
            in: 'cookie',
            description:
              'Authentication will <b>not work</b> as it is currently ' +
              "<a href='https://github.com/swagger-api/swagger-js/issues/1163'>not supported and will not work</a>.",
          },
        },
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info about Swagger here',
      },
    },
    ...fastifyZodOpenApiTransformers,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: SWAGGER_PATH,
    uiConfig: { docExpansion: 'list' },
  });
});

import fastifyMultipart from '@fastify/multipart';
import fp from 'fastify-plugin';

import { MAX_IMAGE_SIZE } from '../config/images';

export default fp(async (app) => {
  await app.register(fastifyMultipart, {
    limits: { fileSize: MAX_IMAGE_SIZE },
  });
});

import sensible from '@fastify/sensible';
import Fastify from 'fastify';
import {
  FastifyZodOpenApiTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi';

import ENV from './env';

import db from './plugins/db';
import serverErrorHandler from './plugins/errorHandler';
import setupHooks from './plugins/hooks';
import multipart from './plugins/multipart';
import notFoundHandler from './plugins/notFoundHandler';
import security from './plugins/security';
import swagger from './plugins/swagger';

import apiRoutes from './routes/api';
import healthRoutes from './routes/health';

const app = Fastify({
  logger: {
    level: ENV.NODE_ENV === 'production' ? 'warn' : 'debug',
    transport:
      ENV.NODE_ENV === 'production'
        ? undefined
        : { target: 'pino-pretty', options: { colorize: true } },
  },
}).withTypeProvider<FastifyZodOpenApiTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setNotFoundHandler(notFoundHandler);
app.setErrorHandler(serverErrorHandler);

const startServer = async () => {
  await app.register(sensible);
  await app.register(multipart);
  await app.register(security);
  await app.register(swagger);

  try {
    await app.register(db);
  } catch (err) {
    app.log.error(err, 'Failed to connect to database');
    process.exit(1);
  }

  await app.register(apiRoutes, { prefix: '/api/v1' });
  await app.register(healthRoutes, { prefix: '/health' });

  app.listen({ port: ENV.PORT, host: '0.0.0.0' }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
};

await startServer();

await setupHooks(app);

export default app;

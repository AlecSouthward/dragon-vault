import sensible from '@fastify/sensible';
import Fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import ENV from './env';

import db from './plugins/db';
import serverErrorHandler from './plugins/errorHandler';
import multipart from './plugins/multipart';
import security from './plugins/security';

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
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(serverErrorHandler);

const startServer = async () => {
  await app.register(sensible);
  await app.register(multipart);
  await app.register(security);

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

export default app;

import fp from 'fastify-plugin';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DB } from '../db/types';

import ENV from '../env';

export default fp(async (app) => {
  const pool = new Pool({ connectionString: ENV.DATABASE_URL });

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });

  app.decorate('db', db);

  app.addHook('onClose', async () => {
    await db.destroy();
    await pool.end();
  });
});

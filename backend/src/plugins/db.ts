import fp from 'fastify-plugin';
import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';

import type { DB } from '../db/types';

import ENV from '../env';

export default fp(async (app) => {
  const pool = new Pool({ connectionString: ENV.DATABASE_URL });

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });

  // Test database connection
  await sql`SELECT 1`.execute(db);

  app.decorate('db', db);

  app.addHook('onClose', async () => {
    await db.destroy();
    await pool.end();
  });

  app.log.info('Server connected to database');
});

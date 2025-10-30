import { Kysely } from 'kysely';

import { DB } from './db/types';

import { User } from './domain';

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>;
  }

  interface FastifyRequest {
    userFromCookie?: User | null;
    campaigns?: Array<{ id: string; name: string }> | null;
  }
}

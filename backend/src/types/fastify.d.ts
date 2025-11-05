import { Kysely } from 'kysely';

import { DB } from '../db/types';

import { SelectableUser } from './domain';

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>;
  }

  interface FastifyRequest {
    userFromCookie?: SelectableUser | null;
    campaigns?: Array<{ id: string; name: string }> | null;
  }
}

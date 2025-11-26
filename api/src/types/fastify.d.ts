import { Kysely } from 'kysely';

import { DB } from '../db/types';

import { SelectableUser } from './domain';

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>;
  }

  interface Session {
    userAccount?: SelectableUser | null;
  }
}

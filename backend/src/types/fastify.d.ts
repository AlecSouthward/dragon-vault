import { User } from './domain';

declare module 'fastify' {
  interface FastifyRequest {
    userFromCookie?: User | null;
    campaigns?: Array<{ id: string; name: string }> | null;
  }
}

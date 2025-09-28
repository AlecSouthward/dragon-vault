import { UUID } from 'node:crypto';

export type Cookie = { id: UUID; username: string; isAdmin: boolean };

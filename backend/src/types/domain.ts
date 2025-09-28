import { UUID } from 'node:crypto';

export type User = {
  id: UUID;
  username: string;
  password: string;
  isAdmin: boolean;
};

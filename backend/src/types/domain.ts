import { UUID } from 'node:crypto';

export type User = {
  id: UUID;
  username: string;
  password: string;
  admin: boolean;
};

export type Campaign = {
  id: UUID;
  creatorUserAccountId: UUID;
  createdDate: Date;
  name: string;
  description: string;
  story: string | undefined;
  icon: string;
};

import { UUID } from 'node:crypto';

export type User = {
  id: UUID;
  username: string;
  password: string;
  profilePicture: string | null;
  admin: boolean;
};

export type Campaign = {
  id: UUID;
  creatorUserAccountId: UUID;
  createdDate: Date;
  name: string;
  description: string;
  active: boolean;
  story: string | undefined;
  icon: string;
};

export type Character = {
  id: UUID;
  userAccountId: UUID;
  campaignId: UUID;
  templateId: UUID;
  createdDate: Date;
  name: string;
  description: string | null;
  alive: boolean;
  level: number;
  attributes: Record<string, string> | undefined;
  resourcePools: Record<string, string> | undefined;
  class: string | null | undefined;
  race: string | null | undefined;
  image: string | null;
};

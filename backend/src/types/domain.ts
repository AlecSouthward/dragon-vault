export type User = {
  id: string;
  username: string;
  password: string;
  profilePicture: string | null;
  admin: boolean;
};

export type Campaign = {
  id: string;
  creatorUserAccountId: string;
  createdDate: Date;
  name: string;
  description: string;
  active: boolean;
  story: string | undefined;
  icon: string;
};

export type Character = {
  id: string;
  userAccountId: string;
  campaignId: string;
  templateId: string;
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

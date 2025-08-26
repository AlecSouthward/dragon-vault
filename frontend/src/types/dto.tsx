export type Campaign = {
  id: string;
  name: string;
  description?: string;
  characterDetails: CampaignCharacterDetails;
};

export type CampaignCharacterDetails = {
  expLevelMulti: number;
};

export type Character = {
  name: string;
  icon?: string;
  class: string;
  race: string;
  level: number;
  exp: number;
  alive: boolean;
  resourcePools: CharacterResourcePool[];
  abilityStats: CharacterAbilityStat[];
  combatStats: CharacterCombatStat[];
  items: Item[];
  features: CharacterFeature[];
  skills: CharacterSkill[];
};

export type CharacterResourcePool = {
  name: string;
  value: number;
  maxValue?: number;
  descriptor?: string;
};

export type CharacterAbilityStat = {
  name: string;
  score: number;
};

export type CharacterCombatStat = {
  name: string;
  value: string | number;
};

export type CharacterFeature = {
  name: string;
  description: string;
  // more fields for appliesTo, etc.
};

export type CharacterSkill = {
  name: string;
  description?: string;
  modifier: number;
  // more fields
};

export type Item = {
  name: string;
  bonus?: number;
  applier?: string | number;
  applierDescriptor?: string;
  // more fields for applyTo, rollFor, etc.
};

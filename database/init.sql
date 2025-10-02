CREATE TABLE users (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "username" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" VARCHAR(255),
    "is_admin" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE user_invites (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "used_by_user_id" UUID REFERENCES users (id)
);

INSERT INTO
    users (username, password, is_admin)
VALUES (
        'admin',
        '$argon2id$v=19$m=131072,t=3,p=1$4AGYvLd91uwQUsrIc3JQSQ$ngHVPKjYZloTtV04NpZsxPXTR9DtolDGDWdOFz17onc', -- root (assuming that PASSWORD_PEPPER is 'passpepper')
        TRUE
    );

CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "name" VARCHAR(96) NOT NULL,
    "description" TEXT,
    "created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_user_id" UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE "campaign_admins" (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    "campaign_id" UUID NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE
);

CREATE TABLE "characters" (
  "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
  "campaign_id" UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "name" VARCHAR(64),
  "description" TEXT,
  "class" VARCHAR(32),
  "race" VARCHAR(64),
  "level" SMALLINT DEFAULT 1,
  "alive" BOOLEAN DEFAULT TRUE,
  "health_bars" JSONB DEFAULT '[]'::jsonb, -- [{"health": {"value": 20, "max": 20}}]
  "stats" JSONB DEFAULT '{}'::jsonb, -- {"strength": 10, "speed": 10}

-- UNFINISHED
-- Skill 'affects' must map dynamically to other stats/health_bars/etc.


"skills" JSONB DEFAULT '[]'::jsonb, -- [{"name": "Heal", "affects": {"health": {"value": "+10"}}}]

  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "items" (
  "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
  "owner_user_id" UUID REFERENCES users(id) ON DELETE CASCADE,
  "name" VARCHAR(128) NOT NULL,
  "description" TEXT,
  "stats" JSON DEFAULT '[]'::jsonb, -- [{"name": "Cost", "value": 2}, {"name": "Rarity", "value": "Mystical"}]
  "damage" JSONB DEFAULT '{}'::jsonb, -- {"type": "slash", "flat": 0, "roll": "1d20"}

-- UNFINISHED
-- Skill 'affects' must map dynamically to other stats/health_bars/etc.
"skills" JSONB DEFAULT '[]'::jsonb -- [{"name": "Heal", "affects": {"health": {"value": "+10"}}}]
);

CREATE TABLE "enemies" (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT
);
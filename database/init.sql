CREATE TABLE users (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "profile_picture" VARCHAR(255),
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO users (id, username, password, is_admin) VALUES (
  -1,
  'admin',
  '$2a$12$Gp0Gs2DLTIoHnB1eTsqgv.Xkt2B1RKAzh.O2aqd02lnaf0QcHA21O', -- root
  TRUE
);

CREATE TABLE "campaigns" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(96) NOT NULL,
  "description" TEXT,
  "created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "creator_user_id" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE "campaign_admins" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "campaign_id" INT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE "characters" (
  "id" SERIAL PRIMARY KEY,
  "campaign_id" INT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  "user_id" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  "id" SERIAL PRIMARY KEY,
  "owner_user_id" INT REFERENCES users(id) ON DELETE CASCADE,
  "name" VARCHAR(128) NOT NULL,
  "description" TEXT,
  "stats" JSON DEFAULT '[]'::jsonb, -- [{"name": "Cost", "value": 2}, {"name": "Rarity", "value": "Mystical"}]
  "damage" JSONB DEFAULT '{}'::jsonb, -- {"type": "slash", "flat": 0, "roll": "1d20"}

  -- UNFINISHED
  -- Skill 'affects' must map dynamically to other stats/health_bars/etc.
  "skills" JSONB DEFAULT '[]'::jsonb -- [{"name": "Heal", "affects": {"health": {"value": "+10"}}}]
);

CREATE TABLE "enemies" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(128) NOT NULL,
  "description" TEXT
);
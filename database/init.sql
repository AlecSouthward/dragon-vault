CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE user_account (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "username" CITEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT FALSE,
    "deleted" BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO
    user_account (username, password, admin)
VALUES (
        'admin',
        '$argon2id$v=19$m=131072,t=3,p=1$4AGYvLd91uwQUsrIc3JQSQ$ngHVPKjYZloTtV04NpZsxPXTR9DtolDGDWdOFz17onc', -- root (assuming that PASSWORD_PEPPER is "passpepper")
        TRUE
    );

CREATE TABLE user_invite (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "used_date" TIMESTAMPTZ,
    "used_by_user_account_id" UUID REFERENCES user_account(id)
);

CREATE TABLE campaign (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "creator_user_account_id" UUID NOT NULL REFERENCES user_account(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "story" TEXT,
    "icon" TEXT
);

CREATE TABLE campaign_admin (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "user_account_id" UUID NOT NULL REFERENCES user_account(id),
    "campaign_id" UUID NOT NULL REFERENCES campaign(id)
);

CREATE TABLE campaign_session (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "campaign_id" UUID NOT NULL REFERENCES campaign(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "start_date" TIMESTAMPTZ,
    "story" TEXT
);

CREATE TABLE activity_log (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "campaign_session_id" UUID NOT NULL REFERENCES campaign_session(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "combat_turn" SMALLINT,
    "log_header" TEXT,
    "log" TEXT NOT NULL
);

CREATE TABLE character_template (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "campaign_id" UUID NOT NULL REFERENCES campaign(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "resource_pools" JSONB,
    "attributes" JSONB
);

CREATE TABLE character (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "user_account_id" UUID NOT NULL REFERENCES user_account(id),
    "template_id" UUID NOT NULL REFERENCES character_template(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" SMALLINT NOT NULL DEFAULT 1,
    "alive" BOOLEAN NOT NULL DEFAULT TRUE,
    "race" TEXT,
    "class" TEXT,
    "resource_pools" HSTORE,
    "attributes" HSTORE,
    "image" TEXT
);

CREATE TABLE character_skill (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "character_id" UUID NOT NULL REFERENCES character(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roll" VARCHAR(18)
);

CREATE TABLE enemy (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "campaign_id" UUID NOT NULL REFERENCES campaign(id),
    "template_id" UUID NOT NULL REFERENCES character_template(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource_pools" HSTORE,
    "attributes" HSTORE,
    "image" TEXT
);

CREATE TABLE enemy_skill (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "enemy_id" UUID NOT NULL REFERENCES enemy(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roll" VARCHAR(18)
);

CREATE TABLE item (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "character_id" UUID NOT NULL REFERENCES character(id),
    "campaign_id" UUID NOT NULL REFERENCES campaign(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roll" VARCHAR(18),
    "image" TEXT
);

CREATE TABLE item_skill (
    "id" UUID NOT NULL DEFAULT uuidv7() PRIMARY KEY,
    "item_id" UUID NOT NULL REFERENCES item(id),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roll" VARCHAR(18)
);

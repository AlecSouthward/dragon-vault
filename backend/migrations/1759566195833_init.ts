import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder) {
  const idColumn = {
    type: 'uuid',
    primaryKey: true,
    notNull: true,
    default: pgm.func('uuidv7()'),
  };

  const createdDateColumn = {
    type: 'timestamptz',
    notNull: true,
    default: pgm.func('now()'),
  };

  pgm.createExtension('hstore', { ifNotExists: true });
  pgm.createExtension('citext', { ifNotExists: true });

  pgm.createTable('user_account', {
    id: idColumn,
    created_date: createdDateColumn,
    username: { type: 'citext', notNull: true, unique: true },
    display_name: { type: 'text' },
    password: { type: 'text', notNull: true },
    profile_picture: { type: 'text', comment: 'A URL path to the picture.' },
    admin: { type: 'boolean', notNull: true, default: false },
    deleted: { type: 'boolean', notNull: true, default: false },
  });

  pgm.createTable('user_invite', {
    id: idColumn,
    created_date: createdDateColumn,
    used_date: { type: 'timestamptz' },
    used_by_user_account_id: {
      type: 'uuid',
      references: 'user_account',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.createTable('campaign', {
    id: idColumn,
    creator_user_account_id: {
      type: 'uuid',
      notNull: true,
      references: 'user_account',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    story: {
      type: 'text',
      comment:
        "Holds important details and plot points about the Campaign's overarching story. " +
        'This field is only viewable by the owner/admins.',
    },
    active: { type: 'boolean', notNull: true, default: true },
    icon: { type: 'text', comment: 'A URL path to the icon.' },
  });

  pgm.createTable('campaign_admin', {
    id: idColumn,
    user_account_id: {
      type: 'uuid',
      notNull: true,
      references: 'user_account',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.createTable('campaign_session', {
    id: idColumn,
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    start_date: { type: 'timestamptz' },
    story: {
      type: 'text',
      comment:
        'This field is only viewable by the owner/admins ' +
        'of the Campaign, not those participating in the session.',
    },
    active: { type: 'boolean', notNull: true, default: false },
  });

  pgm.createTable('combat_session', {
    id: idColumn,
    campaign_session_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign_session',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    start_date: createdDateColumn,
    initiative: {
      type: 'hstore',
      comment:
        'The key stores the character name (player and enemy) and the value is the initiative of that character.',
    },
    active: { type: 'boolean', notNull: true, default: true },
  });

  pgm.createTable('activity_log', {
    id: idColumn,
    campaign_session_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign_session',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    combat_turn: {
      type: 'smallint',
      comment: 'Adds the turn number to the display of the log.',
    },
    log_header: { type: 'text' },
    log: { type: 'text', notNull: true },
  });

  pgm.createTable('character_template', {
    id: idColumn,
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    stats: {
      type: 'jsonb',
      comment: 'Stores things like speed, armor class, initiative, etc.',
      default: pgm.func(`'{}'::jsonb`),
      notNull: true,
    },
    resource_pools: {
      type: 'jsonb',
      comment:
        'Stores the available/allowed resource pools and their information (user-customizable). Eg. health, mana, stamina, etc.',
      default: pgm.func(`'{}'::jsonb`),
      notNull: true,
    },
    abilities: {
      type: 'jsonb',
      comment:
        'Stores the available/allowed ability scores and their information (user-customizable).',
      default: pgm.func(`'{}'::jsonb`),
      notNull: true,
    },
    startingAbilityScoreRoll: { type: 'text', default: '1d20', notNull: true },
  });

  pgm.createTable('character', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: pgm.func('uuidv7()'),
    },
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign',
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
    template_id: {
      type: 'uuid',
      notNull: true,
      references: 'character_template',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    level: { type: 'smallint', notNull: true, default: 1 },
    alive: { type: 'boolean', notNull: true, default: true },
    race: { type: 'text' },
    class: { type: 'text' },
    speed: { type: 'smallint' },
    armor_class: { type: 'smallint' },
    stats: {
      type: 'hstore',
      comment: 'Stores derived stats like speed, armor class, etc.',
    },
    resource_pools: {
      type: 'hstore',
      comment:
        'Key points to the template resource pool while the value ' +
        'is the value of that pool.',
    },
    abilities: {
      type: 'hstore',
      comment:
        'Key points to the template ability name while the value ' +
        'is the score of that ability.',
    },
    image: { type: 'text', comment: 'A URL path to the image.' },
  });

  pgm.createTable('user_character', {
    id: idColumn,
    character_id: {
      type: 'uuid',
      notNull: true,
      references: 'character',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    user_account_id: {
      type: 'uuid',
      notNull: true,
      references: 'user_account',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.createTable('enemy', {
    id: idColumn,
    character_id: {
      type: 'uuid',
      notNull: true,
      references: 'character',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    challenge_rating: {
      type: 'smallint',
      comment: "The rough gauge of an enemy's difficulty and power.",
    },
  });

  pgm.createTable('character_spell', {
    id: idColumn,
    character_id: {
      type: 'uuid',
      notNull: true,
      references: { name: 'character' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    roll: { type: 'varchar(18)', comment: 'Dice notation.' },
    properties: {
      type: 'hstore',
      comment:
        'Miscellaneous properties like range, brightness, weight, speed, etc.',
    },
    cost: {
      type: 'text',
      comment:
        'Keep track of what this spell consumes on use. Eg. "uses 50 mana".',
    },
  });

  pgm.createTable('character_skill', {
    id: idColumn,
    character_id: {
      type: 'uuid',
      notNull: true,
      references: { name: 'character' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    roll: { type: 'varchar(18)', comment: 'Dice notation.' },
  });

  pgm.createTable('character_feat', {
    id: idColumn,
    character_id: {
      type: 'uuid',
      notNull: true,
      references: { name: 'character' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    description: { type: 'text' },
  });

  pgm.createTable('item', {
    id: idColumn,
    character_id: {
      type: 'uuid',
      notNull: true,
      references: { name: 'character' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    roll: { type: 'varchar(18)', comment: 'Dice notation.' },
    image: { type: 'text', comment: 'A URL path to the image.' },
  });

  pgm.createTable('item_skill', {
    id: idColumn,
    item_id: {
      type: 'uuid',
      notNull: true,
      references: 'item',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    roll: { type: 'varchar(18)', comment: 'Dice notation.' },
  });
}

export async function down(pgm: MigrationBuilder) {
  pgm.dropTable('item_skill');
  pgm.dropTable('item');
  pgm.dropTable('character_spell');
  pgm.dropTable('character_skill');
  pgm.dropTable('character_feat');
  pgm.dropTable('enemy');
  pgm.dropTable('user_character');
  pgm.dropTable('character');
  pgm.dropTable('character_template');
  pgm.dropTable('activity_log');
  pgm.dropTable('combat_session');
  pgm.dropTable('campaign_session');
  pgm.dropTable('campaign_admin');
  pgm.dropTable('campaign');
  pgm.dropTable('user_invite');
  pgm.dropTable('user_account');

  pgm.dropExtension('citext', { ifExists: true });
  pgm.dropExtension('hstore', { ifExists: true });
}

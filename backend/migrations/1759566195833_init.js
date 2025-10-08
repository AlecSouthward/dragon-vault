export async function up(pgm) {
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
    resource_pools: {
      type: 'jsonb',
      comment:
        'Stores the available/allowed resource pools and their information (user-customizable). Eg. health, mana, stamina, etc.',
    },
    attributes: {
      type: 'jsonb',
      comment:
        'Stores the available/allowed attributes and their information (user-customizable).',
    },
  });

  pgm.createTable(
    { name: 'character' },
    {
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
      resource_pools: {
        type: 'hstore',
        comment:
          'Key points to the template resource pool while the value ' +
          'is the value of that pool.',
      },
      attributes: {
        type: 'hstore',
        comment:
          'Key points to the template attributes while the value ' +
          'is the value of that attribute.',
      },
      image: { type: 'text', comment: 'A URL path to the image.' },
    }
  );

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
    properties: {
      type: 'hstore',
      comment: 'Miscellaneous properties like range, brightness, weight, etc.',
    },
    cost: {
      type: 'text',
      comment:
        'Keep track of what this skill consumes on use. Eg. "uses 50 mana".',
    },
  });

  pgm.createTable('enemy', {
    id: idColumn,
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: 'campaign',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    template_id: {
      type: 'uuid',
      notNull: true,
      references: 'character_template',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    resource_pools: {
      type: 'hstore',
      comment:
        'Key points to the template resource pool while the value ' +
        'is the value of that pool.',
    },
    attributes: {
      type: 'hstore',
      comment:
        'Key points to the template attribute while the value ' +
        'is the value of that attribute.',
    },
    challenge_rating: {
      type: 'smallint',
      comment: "The rough gauge of an enemy's difficulty and power.",
    },
    image: { type: 'text', comment: 'A URL path to the image.' },
  });

  pgm.createTable('enemy_skill', {
    id: idColumn,
    enemy_id: {
      type: 'uuid',
      notNull: true,
      references: 'enemy',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_date: createdDateColumn,
    name: { type: 'text', notNull: true },
    description: { type: 'text' },
    roll: { type: 'varchar(18)', comment: 'Dice notation.' },
    properties: {
      type: 'hstore',
      comment: 'Miscellaneous properties like range, brightness, weight, etc.',
    },
    cost: {
      type: 'text',
      comment:
        'Keep track of what this skill consumes on use. Eg. "uses 50 mana".',
    },
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

export async function down(pgm) {
  pgm.dropTable('item_skill');
  pgm.dropTable('item');
  pgm.dropTable('enemy_skill');
  pgm.dropTable('enemy');
  pgm.dropTable('character_skill');
  pgm.dropTable('character');
  pgm.dropTable('character_template');
  pgm.dropTable('activity_log');
  pgm.dropTable('campaign_session');
  pgm.dropTable('campaign_admin');
  pgm.dropTable('campaign');
  pgm.dropTable('user_invite');
  pgm.dropTable('user_account');

  pgm.dropExtension('citext', { ifExists: true });
  pgm.dropExtension('hstore', { ifExists: true });
}

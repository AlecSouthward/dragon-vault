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
    profile_picture: { type: 'text' },
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
      onDelete: 'SET NULL',
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
    story: { type: 'text' },
    icon: { type: 'text' },
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
    story: { type: 'text' },
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
    combat_turn: { type: 'smallint' },
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
    resource_pools: { type: 'jsonb' },
    attributes: { type: 'jsonb' },
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
      resource_pools: { type: 'hstore' },
      attributes: { type: 'hstore' },
      image: { type: 'text' },
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
    roll: { type: 'varchar(18)' },
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
    resource_pools: { type: 'hstore' },
    attributes: { type: 'hstore' },
    image: { type: 'text' },
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
    roll: { type: 'varchar(18)' },
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
    roll: { type: 'varchar(18)' },
    image: { type: 'text' },
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
    roll: { type: 'varchar(18)' },
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

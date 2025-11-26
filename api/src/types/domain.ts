import { Selectable } from 'kysely';

import { UserAccount } from '../db/types';

export type SelectableUser = Selectable<UserAccount>;

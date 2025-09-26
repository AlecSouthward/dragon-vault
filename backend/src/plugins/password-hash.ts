import argon2 from 'argon2';

import { ENV } from '../env';

const ARGON2_OPTS = {
  type: argon2.argon2id,
  timeCost: 3,
  memoryCost: 2 ** 17,
  parallelism: 1,
  hashLength: 32,
};

export async function hashPassword(password: string) {
  return argon2.hash(password + ENV.PASSWORD_PEPPER, ARGON2_OPTS);
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password + ENV.PASSWORD_PEPPER);
}

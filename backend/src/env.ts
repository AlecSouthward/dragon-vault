import 'dotenv/config';

const required = ['JWT_SECRET', 'DATABASE_URL', 'PORT'] as const;
for (const k of required)
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);

export const ENV = {
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};

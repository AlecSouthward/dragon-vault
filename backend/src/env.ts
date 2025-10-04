import z from 'zod';

const ENV_SCHEMA = z.strictObject({
  PORT: z.coerce.number().int().min(1).max(65535).nonoptional(),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET should be at least 16 chars')
    .nonempty()
    .nonoptional(),
  COOKIE_SECRET: z
    .string()
    .min(16, 'COOKIE_SECRET should be at least 16 chars')
    .nonempty()
    .nonoptional(),
  DATABASE_URL: z.string().includes('postgresql://').nonempty().nonoptional(),
  PASSWORD_PEPPER: z
    .string()
    .min(8, 'PASSWORD_PEPPER should be at least 8 chars')
    .nonempty()
    .nonoptional(),
  NODE_ENV: z.enum(['production', 'development']),
});

const ENV = {
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
  NODE_ENV: process.env.NODE_ENV,
};

const parseResult = z.safeParse(ENV_SCHEMA, ENV);

if (!parseResult.success) {
  throw new Error('Invalid dotenv file', {
    cause: parseResult.error,
  });
}

export default Object.freeze(parseResult.data);

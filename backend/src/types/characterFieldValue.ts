import z from 'zod';

export const ResourcePoolFieldSchema = z.strictObject({
  currentValue: z.number().int().positive(),
  maxValue: z.number().int().positive(),
});
export type ResourcePoolField = z.infer<typeof ResourcePoolFieldSchema>;

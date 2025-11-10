import z from 'zod';

export const ResourcePoolFieldSchema = z.strictObject({
  currentValue: z.number().int().positive().nonoptional(),
  maxValue: z.number().int().positive().nonoptional(),
});
export type ResourcePoolField = z.infer<typeof ResourcePoolFieldSchema>;

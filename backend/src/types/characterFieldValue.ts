import z from 'zod';

import { DiceSchema } from './dice';

export const AbilityScoreFieldSchema = z.strictObject({
  description: z.string().nonempty().optional(),
  savingThrow: z.number().int().positive(),
  minimum: z.number().int().positive(),
  maximum: z.number().int().positive(),
  initialValueRoll: DiceSchema.nonempty(),
});
export type AbilityScoreField = z.infer<typeof AbilityScoreFieldSchema>;

export const StatFieldSchema = z.strictObject({
  description: z.string().nonempty().optional(),
  minimum: z.number().int().positive(),
  maximum: z.number().int().positive(),
  initialValueRoll: DiceSchema.nonempty(),
});
export type StatField = z.infer<typeof StatFieldSchema>;

export const ResourcePoolFieldSchema = z.strictObject({
  description: z.string().nonempty().optional(),
  unit: z.string().nonempty(),
  initialValueRoll: DiceSchema.nonempty(),
});
export type ResourcePoolField = z.infer<typeof ResourcePoolFieldSchema>;

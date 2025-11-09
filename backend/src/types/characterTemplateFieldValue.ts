import z from 'zod';

import { DiceSchema } from './dice';

export const AbilityScoreTemplateFieldSchema = z.strictObject({
  description: z.string().nonempty().optional(),
  savingThrow: z.number().int().positive(),
  minimum: z.number().int().positive(),
  maximum: z.number().int().positive(),
  initialValueRoll: DiceSchema.nonempty(),
});
export type AbilityScoreTemplateField = z.infer<
  typeof AbilityScoreTemplateFieldSchema
>;

export const StatFieldTemplateSchema = z.strictObject({
  description: z.string().nonempty().optional(),
  minimum: z.number().int().positive(),
  maximum: z.number().int().positive(),
  initialValueRoll: DiceSchema.nonempty(),
});
export type StatField = z.infer<typeof StatFieldTemplateSchema>;

export const ResourcePoolTemplateFieldSchema = z.strictObject({
  description: z.string().nonempty().optional(),
  unit: z.string().nonempty(),
  initialValueRoll: DiceSchema.nonempty(),
});
export type ResourcePoolTemplateField = z.infer<
  typeof ResourcePoolTemplateFieldSchema
>;

import z from 'zod';

export const DiceSchema = z
  .string()
  .regex(/^(\d+)d(\d+)(k\d+)?$/i, 'Invalid dice expression');
export type Dice = z.infer<typeof DiceSchema>;

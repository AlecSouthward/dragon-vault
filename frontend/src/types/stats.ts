import { Affix } from './general';

export interface Value {
  name: string;
  value: number | boolean;
  type: ValueType;
  maxValue?: number;
  identifier?: string;
  identifierAffix?: Affix;
}

export interface FlatValue extends Value {
  name: string;
  value: number;
  type: 'flat';
  identifier?: string;
  identifierAffix?: Affix;
}

export type ValueType =
  | 'percentage' // 10%
  | 'flat' // 10
  | 'fractional' // 10/100
  | 'build' // grows until cap, then reset to 0
  | 'boolean' // true/false
  | 'timer'; // 10s

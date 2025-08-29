import { Affix } from '../types/general';
import { Value } from '../types/stats';

const appendIdentifierToValue = (
  value: Value,
  defaultIdentifier = '',
  defaultIdentifierAffix: Affix = 'suffix',
  forceDefault = false
): string => {
  if (
    value.identifierAffix === 'prefix' ||
    defaultIdentifierAffix === 'prefix'
  ) {
    return `${forceDefault || !value.identifier ? defaultIdentifier : value.identifier}${value.value}`;
  }

  return `${value.value}${forceDefault || !value.identifier ? defaultIdentifier : value.identifier}`;
};

export const getRollBonus = (statScore: number): number => {
  return Math.floor((statScore - 10) / 2);
};

export const formatSignedNumber = (num: number): string => {
  if (num === 0) return '0';
  return (num > 0 ? '+' : '-') + Math.abs(num);
};

export const valueToString = (value: Value): string => {
  switch (value.type) {
    case 'flat':
      return appendIdentifierToValue(value);

    case 'fractional':
      return `${value.value} / ${value.maxValue}${value.identifier ?? ''}`;

    case 'boolean':
      return appendIdentifierToValue(value, '', 'prefix', true);

    case 'build':
      return appendIdentifierToValue(value);

    case 'percentage':
      return appendIdentifierToValue(value, '%', 'suffix', true);

    case 'timer':
      return appendIdentifierToValue(value, 's', 'suffix', true);

    default:
      return appendIdentifierToValue(value);
  }
};

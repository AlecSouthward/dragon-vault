import { ResourcePoolField } from '../types/characterFieldValue';
import {
  AbilityScoreTemplateField,
  ResourcePoolTemplateField,
  StatTemplateField,
} from '../types/characterTemplateFieldValue';

import { DragonVaultError } from './error';

export const formatPairField = (
  template: Record<string, StatTemplateField | AbilityScoreTemplateField>,
  fields: Record<string, number>
) => {
  const cleanFields: Record<string, number> = {};
  const missingFields = [];

  for (const [fieldName, templateField] of Object.entries(template)) {
    const field = Object.entries(fields).find(
      (field) => field[0] === fieldName
    );

    if (!field) {
      missingFields.push(fieldName);

      continue;
    }

    const fieldValue = field[1];

    cleanFields[fieldName] = Math.max(
      Math.min(fieldValue, templateField.maximum),
      templateField.minimum
    );
  }

  if (missingFields.length > 0) {
    throw new DragonVaultError(`Missing fields: ${missingFields.join(', ')}.`);
  }

  return cleanFields;
};

export const validateResourcePoolFields = (
  template: Record<string, ResourcePoolTemplateField>,
  poolFields: Record<string, ResourcePoolField>
) => {
  const missingFields = [];

  for (const [poolName] of Object.entries(template)) {
    const poolField = Object.entries(poolFields).find(
      (poolField) => poolField[0] === poolName
    );

    if (!poolField) {
      missingFields.push(poolName);
    }
  }

  if (missingFields.length > 0) {
    throw new DragonVaultError(
      `Missing Resource Pool fields: ${missingFields.join(', ')}.`
    );
  }
};

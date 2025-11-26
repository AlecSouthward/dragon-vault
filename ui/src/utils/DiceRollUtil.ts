import { DiceRoll, Results } from '@dice-roller/rpg-dice-roller';

import { RollResultVO, RollVO } from '../types/dice';

const getDiceRollOutput = (diceRoll: DiceRoll): string => {
  const diceRollResults = diceRoll.rolls[0];

  const modifiers = diceRoll.rolls.splice(1);
  let diceRollsString;

  if (typeof diceRollResults === 'number') {
    diceRollsString = diceRollResults.toString();
  } else if (diceRollResults instanceof Results.RollResults) {
    const diceRolls = diceRollResults.rolls.filter(
      (roll) => !roll.modifiers.has('drop')
    );

    diceRollsString = diceRolls.map((roll) => roll.initialValue).join(', ');
  }

  const modifiersString = modifiers.join(' ');

  return `[${diceRollsString}] ${modifiersString}`;
};

export const validateDiceRoll = (roll: string): boolean => {
  try {
    new DiceRoll(roll);

    return true;
  } catch {
    return false;
  }
};

export const handleDiceRollAsString = (roll: string): DiceRoll => {
  return new DiceRoll(roll);
};

export const castRollResultsToVO = (diceRoll: DiceRoll): RollResultVO => {
  const rollResults = diceRoll.rolls[0];
  let rolls: RollVO[];

  if (typeof rollResults === 'number' || typeof rollResults === 'string') {
    rolls = [{ value: rollResults } as RollVO];
  } else if (rollResults instanceof Results.RollResults) {
    rolls = rollResults.rolls?.map(
      (roll): RollVO =>
        ({
          value: roll.initialValue,
          drop: roll.modifiers.has('drop'),
        }) as RollVO
    );
  } else {
    throw new Error('Failed to cast roll results to VO');
  }

  const formattedOutput = getDiceRollOutput(diceRoll);

  return { rolls, output: formattedOutput, result: diceRoll.total };
};

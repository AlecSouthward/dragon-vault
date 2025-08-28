import { JSX, useState } from 'react';

import { RollResultVO } from '../types/dice';

import {
  castRollResultsToVO,
  handleDiceRollAsString,
  validateDiceRoll,
} from '../utils/DiceRollUtil';

import DiceToRoll from '../components/DiceToRoll';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';

const RollDice = (): JSX.Element => {
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [rollResult, setRollResult] = useState<RollResultVO>();
  const [rollExpression, setRollExpression] = useState('');
  const [rollExpressionError, setRollExpressionError] = useState(false);

  const handleSetRollExpression = (value: string): void => {
    setRollExpression(value);
    setRollExpressionError(false);
  };

  const handleStartRoll = (): void => {
    if (!rollExpression.includes('d') || !validateDiceRoll(rollExpression)) {
      setRollExpressionError(true);

      return;
    }

    setIsDiceRolling(true);

    const diceRoll = handleDiceRollAsString(rollExpression);
    const diceRollResultVO = castRollResultsToVO(diceRoll);
    setRollResult(diceRollResultVO);

    setTimeout(() => setIsDiceRolling(false), 475);
  };

  return (
    <div className="mt-6 flex flex-1 flex-col items-center justify-center pb-6 select-none">
      <p className="text-light-red h-8 text-xl font-bold">
        {rollExpressionError && 'Invalid roll expression'}
      </p>

      <InputField
        id="roll-expression"
        placeholder="Roll expression"
        value={rollExpression}
        onValueChange={handleSetRollExpression}
      />

      <Button onClick={handleStartRoll} loading={isDiceRolling}>
        Roll
      </Button>

      <div className="flex w-full flex-wrap justify-center px-86">
        {rollResult?.rolls.map((roll, rollIndex) => (
          <DiceToRoll
            key={`${rollIndex}-${roll.value}`}
            result={roll.value}
            dropped={roll.drop}
            rolling={isDiceRolling}
          />
        ))}
      </div>

      <p className="text-3xl">
        {!isDiceRolling && !!rollResult ? rollResult.output : '...'}
      </p>
      <p className="mr-7 text-6xl font-bold">
        = {!isDiceRolling && !!rollResult ? rollResult.result : '?'}
      </p>
    </div>
  );
};

export default RollDice;

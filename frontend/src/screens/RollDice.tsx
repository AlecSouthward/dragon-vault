import { JSX, useState } from 'react';

import DiceToRoll from '../components/DiceToRoll';
import Button from '../components/common/Button';

const RollDice = (): JSX.Element => {
  const [isDiceRolling, setIsDiceRolling] = useState(false);

  const handleStartRoll = (): void => {
    setIsDiceRolling(true);

    setTimeout(() => setIsDiceRolling(false), 475);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <DiceToRoll rolling={isDiceRolling} />
      <Button
        displayText="Roll"
        onClick={handleStartRoll}
        loading={isDiceRolling}
      />
    </div>
  );
};

export default RollDice;

import { FC, JSX, useEffect, useState } from 'react';

type DiceToRollProps = {
  rolling: boolean;
};

const DiceToRoll: FC<DiceToRollProps> = ({ rolling }): JSX.Element => {
  const [rolledNumber, setRolledNumber] = useState(0);

  useEffect(() => {
    if (!rolling) return;

    setRolledNumber(Math.round(Math.random() * 19) + 1);
  }, [rolling]);

  return (
    <div
      className={`m-8 flex h-32 w-32 items-center justify-center rounded-xl border-2 border-zinc-300 text-8xl ${rolling && 'animate-[spin_500ms_ease]'}`}
    >
      <p
        className={`font-bold select-none ${!rolling && (rolledNumber === 20 || rolledNumber === 1) && 'underline'}`}
      >
        {rolling || rolledNumber === 0 ? '?' : rolledNumber}
      </p>
    </div>
  );
};

export default DiceToRoll;

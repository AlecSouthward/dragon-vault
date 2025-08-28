import { FC, JSX } from 'react';

type DiceToRollProps = {
  rolling: boolean;
  result: number | string;
  dropped?: boolean;
};

const DiceToRoll: FC<DiceToRollProps> = ({
  rolling,
  result,
  dropped = false,
}): JSX.Element => (
  <div
    className={`border-light-white m-8 flex h-32 w-32 items-center justify-center rounded-xl border-2 text-8xl ${!rolling && dropped && 'opacity-[0.5]'} ${rolling && 'animate-[spin_500ms_ease]'}`}
  >
    <p
      className={`font-bold select-none ${!rolling && (result === 20 || result === 1) && 'underline'}`}
    >
      {rolling || result === 0 ? '?' : result}
    </p>
  </div>
);

export default DiceToRoll;

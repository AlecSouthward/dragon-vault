import { FC, JSX } from 'react';

type ButtonProps = {
  displayText: string;
  onClick: () => void;
  disabled: boolean;
};

const Button: FC<ButtonProps> = ({
  displayText,
  onClick,
  disabled = false,
}): JSX.Element => {
  return (
    <button
      className="m-2 h-8 w-50 cursor-pointer rounded-sm bg-zinc-300 text-center text-xl font-bold text-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-400"
      onClick={onClick}
      disabled={disabled}
    >
      {displayText}
    </button>
  );
};

export default Button;

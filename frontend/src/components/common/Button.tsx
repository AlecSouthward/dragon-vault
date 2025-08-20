import { FC, JSX } from 'react';

import LoadingIcon from './LoadingIcon';

type ButtonProps = {
  displayText: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
};

const Button: FC<ButtonProps> = ({
  displayText,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  hidden = false,
}): JSX.Element => {
  return (
    <button
      type={type}
      className={`border-light-white text-light-white m-2 flex h-9 w-50 cursor-pointer items-center justify-center rounded-sm border-2 text-center text-xl font-bold disabled:cursor-auto ${loading && 'animate-pulse'} ${hidden && 'invisible'}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <LoadingIcon size="xs" /> : displayText}
    </button>
  );
};

export default Button;

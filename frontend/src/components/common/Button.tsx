import { FC, JSX, ReactNode } from 'react';

import LoadingIcon from './LoadingIcon';

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  className?: string;
};

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  hidden = false,
  className,
}): JSX.Element => {
  return (
    <button
      type={type}
      className={`border-light-white text-light-white bg-light-black m-2 flex h-9 w-50 cursor-pointer items-center justify-center rounded-sm border-2 text-center text-xl font-bold disabled:cursor-auto ${loading && 'animate-pulse'} ${hidden && 'invisible'} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <LoadingIcon size="xs" /> : children}
    </button>
  );
};

export default Button;

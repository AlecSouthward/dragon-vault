import { FC, JSX, ReactNode } from 'react';

import LoadingIcon from './LoadingIcon';

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  className?: string;
};

const widthSizeMap = {
  xs: 'w-30',
  sm: 'w-40',
  md: 'w-50', // default
  lg: 'w-60',
  xl: 'w-70',
  '2xl': 'w-80',
};

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  width = 'md',
  disabled = false,
  loading = false,
  hidden = false,
  className,
}): JSX.Element => {
  return (
    <button
      type={type}
      className={`border-light-white text-light-white bg-light-black m-2 flex h-9 ${widthSizeMap[width]} cursor-pointer items-center justify-center rounded-sm border-2 text-center text-xl font-bold disabled:cursor-auto ${loading && 'animate-pulse'} ${hidden && 'invisible'} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <LoadingIcon size="xs" /> : children}
    </button>
  );
};

export default Button;

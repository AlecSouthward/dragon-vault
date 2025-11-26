import { FC, JSX } from 'react';
import { PiDiceFiveBold } from 'react-icons/pi';

type LoadingIconProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-8 w-8',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
};

const LoadingIcon: FC<LoadingIconProps> = ({
  size = 'sm',
  className = '',
}): JSX.Element => (
  <PiDiceFiveBold className={`${sizeMap[size]} animate-spin ${className}`} />
);

export default LoadingIcon;

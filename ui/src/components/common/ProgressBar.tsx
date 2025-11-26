import { FC, JSX } from 'react';

type ProgressBarProps = {
  maxValue: number;
  value: number;
  height?: 'md' | 'lg';
  width?: 'md' | 'lg';
  className?: string;
};

const widthSizeMap = {
  md: 'w-50', // default
  lg: 'w-70',
};

const heightSizeMap = {
  md: 'h-3', // default
  lg: 'h-6',
};

const ProgressBar: FC<ProgressBarProps> = ({
  maxValue,
  value,
  height = 'md',
  width = 'md',
  className = '',
}): JSX.Element => (
  <div
    className={`border-light-white bg-light-black ${heightSizeMap[height]} ${widthSizeMap[width]} overflow-hidden rounded-sm border-2 ${className}`}
  >
    <div
      className="bg-light-white h-full"
      style={{ width: `${(value / maxValue) * 100}%` }}
    />
  </div>
);

export default ProgressBar;

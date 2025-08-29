import { ChangeEvent, FC, JSX } from 'react';

type InputTextAreaProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '8xl';
  className?: string;
};

const widthSizeMap = {
  xs: 'w-30',
  sm: 'w-40',
  md: 'w-50', // default
  lg: 'w-60',
  xl: 'w-70',
  '2xl': 'w-80',
  '8xl': 'w-160',
};

const heightSizeMap = {
  xs: 'h-8',
  sm: 'h-16',
  md: 'h-24', // default
  lg: 'h-30',
  xl: 'h-38',
};

const InputTextArea: FC<InputTextAreaProps> = ({
  id,
  value,
  onValueChange,
  disabled = false,
  placeholder = '',
  height = 'md',
  width = 'md',
  className,
}): JSX.Element => {
  const handleOnChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    onValueChange(evt.target?.value);
  };

  return (
    <textarea
      id={id}
      className={`border-light-white text-light-white m-2 resize-none pt-1 leading-6 ${heightSizeMap[height]} ${widthSizeMap[width]} rounded-sm border-2 px-2 py-4 text-xl outline-0 disabled:pointer-events-none disabled:opacity-[0.5] ${className}`}
      value={value}
      onChange={handleOnChange}
      placeholder={placeholder}
      disabled={disabled}
      spellCheck={false}
    />
  );
};

export default InputTextArea;

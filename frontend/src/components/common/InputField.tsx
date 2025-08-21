import { ChangeEvent, FC, JSX } from 'react';

type InputFieldProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  type?: 'text' | 'password';
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  disabled?: boolean;
  placeholder?: string;
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

const InputField: FC<InputFieldProps> = ({
  id,
  value,
  onValueChange,
  type = 'text',
  disabled = false,
  placeholder = '',
  width = 'md',
  className = '',
}): JSX.Element => {
  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    onValueChange(evt.target?.value);
  };

  return (
    <input
      id={id}
      className={`border-light-white text-light-white m-2 h-9 ${widthSizeMap[width]} rounded-sm border-2 px-2 py-4 text-xl outline-0 disabled:pointer-events-none disabled:opacity-[0.5] ${className}`}
      type={type}
      value={value}
      onChange={handleOnChange}
      placeholder={placeholder}
      disabled={disabled}
      spellCheck={false}
    />
  );
};

export default InputField;

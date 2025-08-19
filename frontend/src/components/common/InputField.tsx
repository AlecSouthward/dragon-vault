import { ChangeEvent, FC, JSX } from 'react';

type InputFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
  disabled?: boolean;
  placeholder?: string;
};

const InputField: FC<InputFieldProps> = ({
  id,
  value,
  onChange,
  type = 'text',
  disabled = false,
  placeholder = '',
}): JSX.Element => {
  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    onChange(evt.target?.value);
  };

  return (
    <input
      className="border-light-white text-light-white m-2 h-8 w-50 rounded-sm border-2 px-2 py-4 text-xl outline-0 disabled:pointer-events-none disabled:opacity-[0.5]"
      type={type}
      value={value}
      onChange={handleOnChange}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
    />
  );
};

export default InputField;

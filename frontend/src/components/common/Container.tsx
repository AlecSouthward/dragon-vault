import { FC, JSX, ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  key?: string;
};

const Container: FC<ContainerProps> = ({
  children,
  className = '',
  key,
}): JSX.Element => (
  <div
    key={key}
    className={`bg-light-black border-light-white flex rounded-sm border-2 ${className}`}
  >
    {children}
  </div>
);

export default Container;

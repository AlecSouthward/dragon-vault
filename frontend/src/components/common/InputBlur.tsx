import { FC, JSX, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type InputBlurProps = {
  open: boolean;
  children?: ReactNode;
};

const InputBlur: FC<InputBlurProps> = ({ children, open }): JSX.Element => {
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
  }, [open]);

  return createPortal(
    <div
      className={`fixed top-0 left-0 z-2 flex h-full w-full flex-col items-center justify-center bg-black/50 transition-opacity ${!open && 'pointer-events-none opacity-0'}`}
    >
      {children}
    </div>,
    document.body
  );
};

export default InputBlur;

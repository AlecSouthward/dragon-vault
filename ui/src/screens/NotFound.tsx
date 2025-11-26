import { JSX } from 'react';
import { FaDice } from 'react-icons/fa';

const NotFound = (): JSX.Element => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <FaDice className="absolute h-64 w-64 self-center opacity-[0.1]" />
      <h1 className="text-5xl select-none">
        <b>404</b> - Not Found
      </h1>
    </div>
  );
};

export default NotFound;

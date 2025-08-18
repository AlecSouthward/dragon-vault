import { JSX } from 'react';
import { FaDice } from 'react-icons/fa';

const NotFound = (): JSX.Element => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <FaDice className="h-16 w-16" />
      <h1 className="text-5xl select-none">Not Found</h1>
    </div>
  );
};

export default NotFound;

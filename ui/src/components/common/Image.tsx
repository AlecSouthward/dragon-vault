import { FC, JSX, useState } from 'react';

type ImageProps = {
  src: string | undefined;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: 'w-18 h-18',
  md: 'w-28 h-28', // default
  lg: 'w-38 h-38',
};

const Image: FC<ImageProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
}): JSX.Element => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className={`border-light-white pointer-events-none ${sizeMap[size]} overflow-clip rounded-md border-2 ${className}`}
    >
      {loading && (
        <div
          className={`bg-light-white h-full w-full animate-[pulse_1s_infinite]`}
        />
      )}

      <img
        className={`h-full w-full object-cover ${!src && 'p-5'} ${loading ? 'opacity-0' : 'opacity-100'}`}
        src={src ?? 'img-placeholder.svg'}
        fetchPriority="low"
        alt={alt}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default Image;

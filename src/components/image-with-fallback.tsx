import { useState } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';
const MINIO_ENDPOINT = import.meta.env.VITE_MINIO_ENDPOINT;

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
  [key: string]: any;
}

export const ImageWithFallback = ({
  src,
  alt,
  style,
  className,
  ...rest
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<boolean>(false);

  const getFullImageUrl = (): string => {
    if (!src) {
      setError(true);
    }

    if (src.startsWith('http') || src.startsWith('blob:')) {
      return src;
    }

    return `${MINIO_ENDPOINT}${src}`;
  };

  const handleError = (): void => {
    setError(true);
  };

  return error ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className='flex h-full w-full items-center justify-center'>
        <img
          src={ERROR_IMG_SRC}
          alt='Error loading image'
          {...rest}
          data-original-url={getFullImageUrl()}
        />
      </div>
    </div>
  ) : (
    <img
      src={getFullImageUrl()}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
};

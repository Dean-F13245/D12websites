import { useImageOptimization } from '@/hooks/useImageOptimization';
import { cn } from '@/lib/utils';
import { SyntheticEvent } from 'react';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  onError?: (error: Error) => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality,
  loading = 'lazy',
  placeholder,
  className,
  aspectRatio = 'auto',
  onError,
  ...props
}: OptimizedImageProps) {
  const {
    imageProps,
    isLoaded,
    error,
    handleError
  } = useImageOptimization({
    src,
    alt,
    width,
    height,
    quality,
    loading,
    placeholder
  });

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    handleError(e as unknown as ErrorEvent);
    if (onError && error) {
      onError(error);
    }
  };

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          aspectRatioClasses[aspectRatio],
          className
        )}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <img
        {...props}
        {...imageProps}
        onError={handleImageError}
        className={cn(
          'w-full h-full object-cover',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100'
        )}
      />
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
    </div>
  );
} 
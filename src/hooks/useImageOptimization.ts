import { useState, useEffect, useRef } from 'react';

interface UseImageOptimizationProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
}

export function useImageOptimization({
  src,
  alt,
  width,
  height,
  quality = 80,
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMWYxZjEiLz48L3N2Zz4='
}: UseImageOptimizationProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URL
  const getOptimizedImageUrl = () => {
    if (!src) return '';
    
    // If the image is already from an optimization service, return as is
    if (src.includes('cdn') || src.includes('optimized')) {
      return src;
    }

    // Add width and quality parameters if provided
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (quality) params.append('q', quality.toString());
    
    return `${src}?${params.toString()}`;
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = getOptimizedImageUrl();
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    if (loading === 'lazy') {
      observer.observe(img);
    } else {
      img.src = getOptimizedImageUrl();
    }

    return () => {
      if (img) {
        observer.unobserve(img);
      }
    };
  }, [src, width, quality, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: ErrorEvent) => {
    setError(e.error || new Error('Failed to load image'));
  };

  return {
    imgRef,
    isLoaded,
    error,
    handleLoad,
    handleError,
    placeholder,
    optimizedSrc: getOptimizedImageUrl(),
    imageProps: {
      ref: imgRef,
      alt,
      width,
      height,
      loading,
      onLoad: handleLoad,
      onError: handleError,
      style: {
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundImage: `url(${placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
  };
} 
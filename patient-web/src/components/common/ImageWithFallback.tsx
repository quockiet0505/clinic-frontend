import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  containerClassName,
  fallbackText,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center img-fallback-gradient text-primary-600',
          containerClassName,
          className
        )}
      >
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        {fallbackText && <span className="text-sm font-medium opacity-70">{fallbackText}</span>}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <img
        src={src}
        alt={alt}
        className={cn('object-cover w-full h-full', className)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}

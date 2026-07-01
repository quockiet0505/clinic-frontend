import React, { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/image';
import { cn } from '@/lib/utils';

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-10 h-10 text-sm',
} as const;

interface EntityAvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

function getInitial(name: string) {
  const trimmed = (name || '?').trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export default function EntityAvatar({ name, imageUrl, size = 'md', className = '' }: EntityAvatarProps) {
  const [failed, setFailed] = useState(false);
  const resolved = getImageUrl(imageUrl || undefined);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  const showImage = resolved && !failed;

  return (
    <div
      className={cn(
        SIZE_MAP[size],
        "rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden",
        !showImage ? "bg-gradient-to-br from-primary-500 to-primary-300 text-white" : "bg-slate-50",
        className
      )}
      title={name}
    >
      {showImage ? (
        <img
          src={resolved}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{getInitial(name)}</span>
      )}
    </div>
  );
}

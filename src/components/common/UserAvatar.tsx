import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showInitialsIfNoImage?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'Pengguna',
  name = '',
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  // If no src is provided or image failed to load, show neutral default silhouette / empty avatar
  const isImageAvailable = Boolean(src && src.trim().length > 0 && !hasError);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-24 h-24 text-xl sm:w-28 sm:h-28',
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (!isImageAvailable) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-500 font-bold border border-slate-200/80 shadow-2xs select-none shrink-0 ${sizeClasses[size]} ${className}`}
        title={name || alt}
      >
        {name && size !== 'xs' ? (
          <span className="font-bold tracking-tight text-slate-600">{getInitials(name)}</span>
        ) : (
          <UserIcon className="w-1/2 h-1/2 text-slate-400" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src!}
      alt={alt}
      onError={() => setHasError(true)}
      className={`rounded-full object-cover shrink-0 ${sizeClasses[size]} ${className}`}
    />
  );
};

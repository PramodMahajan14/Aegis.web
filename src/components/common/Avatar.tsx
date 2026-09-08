import { Icon } from '@blueprintjs/core';
import React from 'react';
import { cn } from '../../lib/cn';

export interface AvatarProps {
  firstName: string;
  lastName?: string;
  imageUrl?: string;
  jobRole?: string | undefined | null;
  email?: string | undefined | null;
  size?: 'sm' | 'md' | 'lg';
  hideDetails?: boolean;
}

const sizeMap = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName = '',
  imageUrl,
  jobRole = null,
  email = null,
  size = 'md',
  hideDetails = false,
}) => {
  const initials = `${firstName} ${lastName}`
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const subtitle = jobRole || email;

  return (
    <div className="flex items-center gap-3">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={firstName}
          className={cn('shrink-0 rounded-full object-cover', sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-stronger',
            sizeMap[size],
          )}
        >
          {initials}
        </div>
      )}

      {!hideDetails && (
        <div className="min-w-0">
          <div className="truncate font-semibold text-foreground">
            {`${firstName} ${lastName}`.trim()}
          </div>
          {subtitle && (
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon icon={email ? 'envelope' : 'briefcase'} size={11} />
              <span className="truncate">{subtitle}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

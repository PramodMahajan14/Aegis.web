import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon = 'bi-inbox',
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-1.5 py-8' : 'gap-2 py-14',
        className,
      )}
    >
      <span
        className={cn(
          'grid place-items-center rounded-xl bg-accent text-muted-foreground',
          compact ? 'size-9 text-base' : 'size-12 text-xl',
        )}
      >
        <i className={`bi ${icon}`} />
      </span>
      <p className="mt-1 font-medium text-foreground">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

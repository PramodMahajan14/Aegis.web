import React from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

// Outlined uppercase tags — no pill shape, no dot.
const variants: Record<BadgeVariant, string> = {
  neutral: 'border-border-strong text-muted-foreground',
  brand: 'border-brand-border text-brand-stronger',
  success: 'border-success/40 text-success',
  warning: 'border-warning/40 text-warning',
  danger: 'border-danger/40 text-danger',
  info: 'border-info/40 text-info',
  outline: 'border-border-strong text-muted-foreground',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Kept for API compatibility; tags no longer render a dot. */
  dot?: boolean;
}

export function Badge({ className, variant = 'neutral', dot: _dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-1.5 py-px text-[0.625rem] font-medium uppercase leading-4 tracking-[0.06em]',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

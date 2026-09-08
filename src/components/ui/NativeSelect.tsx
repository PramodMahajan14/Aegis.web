import React from 'react';
import { cn } from '../../lib/cn';
import { fieldBase } from './Input';

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ className, invalid, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            fieldBase,
            'h-9 appearance-none pl-3 pr-9',
            invalid
              ? 'border-danger focus-visible:ring-danger/25'
              : 'border-input hover:border-muted-foreground/50 focus-visible:border-ring',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <i className="bi bi-chevron-expand pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" />
      </div>
    );
  },
);

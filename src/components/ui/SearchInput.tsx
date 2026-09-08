import React from 'react';
import { cn } from '../../lib/cn';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { className, wrapClassName, ...props },
  ref,
) {
  return (
    <div className={cn('relative', wrapClassName)}>
      <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        className={cn(
          'h-9 w-full rounded-md border border-input bg-surface pl-9 pr-3 text-sm text-foreground shadow-xs',
          'placeholder:text-muted-foreground/70 transition-colors hover:border-muted-foreground/50',
          'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
          '[&::-webkit-search-cancel-button]:appearance-none',
          className,
        )}
        {...props}
      />
    </div>
  );
});

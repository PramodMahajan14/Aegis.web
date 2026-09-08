import React from 'react';
import { cn } from '../../lib/cn';

const fieldBase =
  'w-full rounded-lg border bg-surface text-[0.8125rem] text-foreground shadow-xs transition-[color,box-shadow,border-color] ' +
  'placeholder:text-muted-foreground/65 focus-visible:outline-none focus-visible:ring-4 ' +
  'focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, sizeVariant = 'md', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBase,
        sizeVariant === 'sm' && 'h-8 px-2.5',
        sizeVariant === 'md' && 'h-9 px-3',
        sizeVariant === 'lg' && 'h-11 px-3.5',
        invalid
          ? 'border-danger focus-visible:ring-danger/25'
          : 'border-input hover:border-muted-foreground/50 focus-visible:border-ring',
        className,
      )}
      {...props}
    />
  );
});

export { fieldBase };

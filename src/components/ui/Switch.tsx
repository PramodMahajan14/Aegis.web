import React from 'react';
import { cn } from '../../lib/cn';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, label, id, ...props },
  ref,
) {
  return (
    <label
      htmlFor={id}
      className={cn('inline-flex cursor-pointer items-center gap-3 text-sm text-foreground', className)}
    >
      <span className="relative inline-flex">
        <input ref={ref} id={id} type="checkbox" className="peer sr-only" {...props} />
        <span className="h-5 w-9 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring/55 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background" />
        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-surface shadow-sm transition-transform peer-checked:translate-x-4" />
      </span>
      {label}
    </label>
  );
});

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'size-4 cursor-pointer rounded border-input text-primary accent-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/55',
        className,
      )}
      {...props}
    />
  );
});

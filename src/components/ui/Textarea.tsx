import React from 'react';
import { cn } from '../../lib/cn';
import { fieldBase } from './Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBase,
        'min-h-[90px] px-3 py-2 leading-relaxed',
        invalid
          ? 'border-danger focus-visible:ring-danger/25'
          : 'border-input hover:border-muted-foreground/50 focus-visible:border-ring',
        className,
      )}
      {...props}
    />
  );
});

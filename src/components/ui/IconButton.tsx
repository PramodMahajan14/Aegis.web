import React from 'react';
import { cn } from '../../lib/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
  active?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, size = 'md', active, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-45',
        size === 'sm' ? 'size-8 text-[0.9rem]' : 'size-9 text-[0.95rem]',
        active && 'bg-accent text-foreground',
        className,
      )}
      {...props}
    />
  );
});

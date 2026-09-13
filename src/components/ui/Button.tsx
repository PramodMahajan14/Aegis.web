import React from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'danger'
  | 'danger-ghost'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

const base =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium tracking-[-0.01em] ' +
  'transition-[background-color,box-shadow,color,transform,border-color] duration-150 select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985] ' +
  "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface text-foreground shadow-xs hover:bg-accent',
  outline:
    'border border-border-strong bg-surface text-foreground shadow-xs hover:bg-accent',
  ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
  subtle:
    'border border-brand-border bg-brand-soft text-brand-stronger hover:border-brand hover:bg-brand-soft',
  danger: 'bg-danger text-danger-foreground shadow-xs hover:brightness-[0.94]',
  'danger-ghost': 'text-danger hover:bg-danger-soft',
  link: 'h-auto px-0 text-brand-strong hover:text-brand-stronger hover:underline underline-offset-4',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-2.5 text-[0.8125rem]',
  md: 'h-9 px-3.5 text-[0.8125rem]',
  lg: 'h-10 px-5 text-sm',
  icon: 'size-9',
  'icon-sm': 'size-8 rounded-md',
};

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className }) + " cursor-pointer"}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
});

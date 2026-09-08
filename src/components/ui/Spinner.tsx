import { cn } from '../../lib/cn';

export interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block size-4 animate-[aegis-spin_0.7s_linear_infinite] rounded-full',
        'border-2 border-border border-t-brand',
        className,
      )}
    />
  );
}

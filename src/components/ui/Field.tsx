import React from 'react';
import { cn } from '../../lib/cn';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 text-[0.8125rem] font-medium text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function RequiredMark() {
  return <span className="text-danger">*</span>;
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1 text-xs font-medium text-danger" role="alert">
      {children}
    </p>
  );
}

export function FieldHint({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}

export interface FieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
  labelExtra?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  labelExtra,
  children,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label != null && (
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={htmlFor}>
            {label}
            {required && <RequiredMark />}
          </Label>
          {labelExtra}
        </div>
      )}
      {children}
      <FieldError>{error}</FieldError>
      {!error && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}

import React from 'react';
import { cn } from '../../lib/cn';

export function TableWrap({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />;
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full border-collapse text-[0.8125rem]', className)} {...props} />;
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'border-b border-border [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left',
        '[&_th]:text-[0.6875rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.06em]',
        '[&_th]:text-muted-foreground [&_th]:whitespace-nowrap',
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        '[&_tr]:border-b [&_tr]:border-border [&_tr:last-child]:border-0',
        '[&_td]:px-4 [&_td]:py-2.5 [&_td]:align-middle',
        '[&_tr]:transition-colors hover:[&_tr]:bg-accent/50',
        className,
      )}
      {...props}
    />
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr className="hover:!bg-transparent">
      <td colSpan={colSpan} className="px-4 py-16 text-center text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

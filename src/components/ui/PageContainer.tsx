import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Full-bleed page wrapper. The workspace content area owns the width now —
    pages fill it instead of centering in a narrow column. `width="prose"`
    keeps list-heavy screens readable on ultra-wide displays. */
export function PageContainer({
  children,
  width = 'full',
  className,
}: {
  children: ReactNode;
  width?: 'full' | 'prose';
  className?: string;
}) {
  return (
    <div className={cn('w-full px-4 py-5 sm:px-6 lg:px-8', className)}>
      <div className={cn('mx-auto', width === 'prose' ? 'max-w-4xl' : 'max-w-[1600px]')}>
        {children}
      </div>
    </div>
  );
}

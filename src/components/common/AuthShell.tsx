import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-[400px] border border-border bg-surface p-8">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <i className="bi bi-shield-fill-check text-sm" />
          </span>
          <div className="leading-tight">
            <div className="text-[0.9375rem] font-semibold text-foreground">Aegis</div>
            <div className="text-[0.6875rem] text-muted-foreground">Sales CRM</div>
          </div>
        </div>

        <h1 className="text-[1.375rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

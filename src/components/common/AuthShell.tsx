import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[36rem] rounded-full bg-brand/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-[32rem] rounded-full bg-info/15 blur-[120px]"
      />

      <div className="relative w-full max-w-[420px] rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <i className="bi bi-shield-fill-check text-sm" />
          </span>
          Aegis
        </div>

        <h1 className="text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

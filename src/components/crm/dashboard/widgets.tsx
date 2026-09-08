import type { ReactNode } from 'react';
import { Card } from '../../ui/Card';
import { cn } from '../../../lib/cn';
import { Sparkline } from '../charts';

/* Recharts theming ---------------------------------------------------- */

export const CHART = {
  grid: 'var(--border)',
  axis: 'var(--muted-foreground)',
  brand: 'var(--brand)',
  info: 'var(--info)',
  warning: 'var(--warning)',
  success: 'var(--success)',
  danger: 'var(--danger)',
  muted: 'var(--muted-foreground)',
};

/** Categorical series colours — fixed order, never cycled (dataviz rule). */
export const SERIES = [
  'var(--brand)',
  'var(--info)',
  'var(--warning)',
  'var(--success)',
  'var(--danger)',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export const axisProps = {
  stroke: CHART.axis,
  tick: { fill: CHART.axis, fontSize: 11 },
  tickLine: false,
  axisLine: { stroke: CHART.grid },
} as const;

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; color?: string; dataKey?: string }[];
  label?: string | number;
  formatter?: (v: number | string, name?: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-md">
      {label != null && <div className="mb-1 font-medium text-foreground">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name ?? p.dataKey}</span>
          <span className="ml-auto font-semibold tabular-nums text-foreground">
            {formatter && p.value != null ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Cards ------------------------------------------------------------- */

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-[-0.014em]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </Card>
  );
}

export function KpiTile({
  label,
  value,
  delta,
  deltaTone,
  icon,
  spark,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'flat';
  icon?: string;
  spark?: number[];
}) {
  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && <i className={`bi ${icon} text-muted-foreground`} />}
      </div>
      <div className="mt-1.5 text-[1.55rem] font-semibold leading-none tracking-tight tabular-nums text-foreground">
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            'mt-1.5 flex items-center gap-1 text-xs',
            deltaTone === 'up' && 'text-success',
            deltaTone === 'down' && 'text-danger',
            (!deltaTone || deltaTone === 'flat') && 'text-muted-foreground',
          )}
        >
          {deltaTone === 'up' && <i className="bi bi-arrow-up-right" />}
          {deltaTone === 'down' && <i className="bi bi-arrow-down-right" />}
          {delta}
        </div>
      )}
      {spark && <Sparkline data={spark} className="mt-2 -mb-1" />}
    </Card>
  );
}

export function GaugeBar({ label, pct, hint }: { label: string; pct: number; hint?: string }) {
  const clamped = Math.max(0, Math.min(pct, 100));
  const tone = pct >= 100 ? 'bg-success' : pct >= 60 ? 'bg-brand' : pct >= 30 ? 'bg-warning' : 'bg-danger';
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[0.8125rem]">
        <span className="text-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-foreground">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className={cn('h-full rounded-full transition-[width] duration-500', tone)} style={{ width: `${clamped}%` }} />
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

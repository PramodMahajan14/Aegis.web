import { cn } from '../../lib/cn';

/* Lightweight, design-system-native charts. Thin marks, rounded data-ends,
   recessive axes, direct labels, hover via <title>. No chart library. */

type Tone = 'brand' | 'info' | 'warning' | 'success' | 'danger' | 'muted';

const BAR: Record<Tone, string> = {
  brand: 'bg-brand',
  info: 'bg-info',
  warning: 'bg-warning',
  success: 'bg-success',
  danger: 'bg-danger',
  muted: 'bg-muted-foreground/40',
};

/* -------------------------------------------------------------- Funnel */

export interface FunnelStage {
  label: string;
  value: number;
  tone?: Tone;
  hint?: string;
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div className="space-y-1.5">
      {stages.map((s, i) => {
        const prev = i > 0 ? stages[i - 1].value : null;
        const conv = prev && prev > 0 ? Math.round((s.value / prev) * 100) : null;
        return (
          <div key={s.label} className="group flex items-center gap-3" title={s.hint}>
            <div className="w-28 shrink-0 text-right text-[0.8125rem] text-muted-foreground">
              {s.label}
            </div>
            <div className="relative h-8 flex-1">
              <div
                className={cn(
                  'flex h-full items-center justify-end rounded-md pr-2 text-xs font-semibold text-white transition-[width] duration-500',
                  BAR[s.tone ?? 'brand'],
                )}
                style={{ width: `${Math.max((s.value / max) * 100, s.value > 0 ? 8 : 2)}%` }}
              >
                {s.value > 0 && s.value}
              </div>
              {s.value === 0 && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  0
                </span>
              )}
            </div>
            <div className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {conv != null ? `${conv}%` : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------- Value bars */

export interface ValueBar {
  label: string;
  value: number;
  tone?: Tone;
  display?: string;
}

export function ValueBars({ items }: { items: ValueBar[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.every((i) => i.value === 0)) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No data in range</p>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <div className="w-28 shrink-0 truncate text-right text-[0.8125rem] text-muted-foreground">
            {it.label}
          </div>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className={cn('h-full rounded-full transition-[width] duration-500', BAR[it.tone ?? 'brand'])}
              style={{ width: `${Math.max((it.value / max) * 100, it.value > 0 ? 3 : 0)}%` }}
            />
          </div>
          <div className="w-20 shrink-0 text-right text-[0.8125rem] font-medium tabular-nums text-foreground">
            {it.display ?? it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------ Stacked bar */

export interface Segment {
  label: string;
  value: number;
  className: string; // e.g. 'bg-danger'
  text: string; // legend text colour class
}

export function StackedBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
        {total === 0 ? (
          <div className="h-full flex-1 bg-surface-2" />
        ) : (
          segments
            .filter((s) => s.value > 0)
            .map((s) => (
              <div
                key={s.label}
                className={cn('h-full first:rounded-l-full last:rounded-r-full', s.className)}
                style={{ width: `${(s.value / total) * 100}%` }}
                title={`${s.label}: ${s.value}`}
              />
            ))
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn('size-2 rounded-full', s.className)} />
            {s.label}
            <span className={cn('font-semibold tabular-nums', s.text)}>{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Sparkline area */

export function Sparkline({
  data,
  className,
  tone = 'brand',
}: {
  data: number[];
  className?: string;
  tone?: Tone;
}) {
  const w = 240;
  const h = 48;
  const max = Math.max(1, ...data);
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((d, i) => [i * step, h - (d / max) * (h - 6) - 3] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const stroke =
    tone === 'brand'
      ? 'var(--brand)'
      : tone === 'success'
        ? 'var(--success)'
        : tone === 'warning'
          ? 'var(--warning)'
          : 'var(--info)';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn('h-12 w-full', className)}>
      <path d={area} fill={stroke} opacity={0.12} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

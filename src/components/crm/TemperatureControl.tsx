import { cn } from '../../lib/cn';
import { TEMPERATURE_META } from '../../crm/constants';
import type { Temperature } from '../../crm/types';

const ORDER: Temperature[] = ['COLD', 'WARM', 'HOT'];

const ACTIVE: Record<Temperature, string> = {
  COLD: 'bg-info-soft text-info',
  WARM: 'bg-warning-soft text-warning',
  HOT: 'bg-danger-soft text-danger',
};

export function TemperatureControl({
  value,
  onChange,
  size = 'md',
}: {
  value?: Temperature;
  onChange: (t: Temperature) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Temperature"
      className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5"
    >
      {ORDER.map((t) => {
        const meta = TEMPERATURE_META[t];
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(t)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-medium transition-colors',
              size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-[0.8125rem]',
              active
                ? ACTIVE[t]
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <i className={`bi ${meta.icon}`} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

export function TemperaturePill({ value }: { value?: Temperature }) {
  if (!value) return <span className="text-xs text-muted-foreground">Not set</span>;
  const meta = TEMPERATURE_META[value];
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', meta.className)}>
      <i className={`bi ${meta.icon}`} />
      {meta.label}
    </span>
  );
}

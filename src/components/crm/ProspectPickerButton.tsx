import { useState } from 'react';
import { Popover } from '@blueprintjs/core';
import { cn } from '../../lib/cn';
import { useProspects } from '../../crm/hooks';
import { StatusBadge } from './StatusBadge';
import { PersonAvatar } from './PersonAvatar';

/** Quick-capture button that first asks which prospect the work belongs to. */
export function ProspectPickerButton({
  label,
  icon,
  onPick,
  variant = 'tile',
}: {
  label: string;
  icon: string;
  onPick: (prospectId: string) => void;
  variant?: 'tile' | 'ghost';
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const prospects = useProspects({ search: q, status: 'ACTIVE_SET' });

  return (
    <Popover
      isOpen={open}
      onInteraction={setOpen}
      placement="bottom-start"
      content={
        <div className="w-72 p-1.5">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a prospect…"
            className="mb-1 h-8 w-full rounded-md border border-input bg-surface px-2.5 text-[0.8125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
          />
          <div className="max-h-64 overflow-y-auto">
            {prospects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onPick(p.id);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
              >
                <PersonAvatar name={p.name} size="xs" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] font-medium text-foreground">
                    {p.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{p.prospectNo}</span>
                </span>
                <StatusBadge status={p.status} />
              </button>
            ))}
            {prospects.length === 0 && (
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">No active prospects</p>
            )}
          </div>
        </div>
      }
    >
      {variant === 'tile' ? (
        <button
          type="button"
          className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-3.5 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-brand hover:bg-accent"
        >
          <i className={cn('bi text-lg text-brand-strong', icon)} />
          {label}
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-brand hover:bg-accent"
        >
          <i className={cn('bi text-brand-strong', icon)} />
          {label}
        </button>
      )}
    </Popover>
  );
}

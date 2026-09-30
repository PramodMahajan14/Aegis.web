import { Menu, MenuDivider, MenuItem, Popover, Spinner } from '@blueprintjs/core';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';
import { STATUS_LABEL, STATUS_TRANSITIONS, STATUS_VARIANT } from '../../crm/constants';
import type { ProspectStatus } from '../../crm/types';
import type { basicNext } from '../../hooks/Prospect/ProspectType';

const TAG_CLASS: Record<string, string> = {
  neutral: 'border-border-strong text-muted-foreground',
  outline: 'border-border-strong text-muted-foreground',
  brand: 'border-brand-border text-brand-stronger',
  success: 'border-success/40 text-success',
  warning: 'border-warning/40 text-warning',
  danger: 'border-danger/40 text-danger',
  info: 'border-info/40 text-info',
};

export function StatusBadge({ status, className }: { status: basicNext; className?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status.code as ProspectStatus]} className={className}>
      {status.name}
    </Badge>
  );
}

interface StatusMenuProps {
  status: ProspectStatus;
  isChangingStatus: boolean;
  onChange: (next: ProspectStatus) => void;
  onConvert?: () => void;
  className?: string;
}

/** Interactive status control — only offers transitions allowed by the
    state machine (blueprint §6, Figure 6). */
export function StatusMenu({ status, isChangingStatus, onChange, onConvert, className }: StatusMenuProps) {
  const targets = STATUS_TRANSITIONS[status];
  if (isChangingStatus) {
    return (
      <span className="inline-flex h-6 items-center gap-1.5 rounded-sm border border-border-strong px-2 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        <Spinner size={12} />
        Updating
      </span>
    );
  }
  return (
    <Popover
      placement="bottom-start"
      disabled={targets.length === 0}
      content={
        <Menu>
          <li className="px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Move to
          </li>
          {targets.map((t) =>
            t === 'CONVERTED' ? (
              <MenuItem
                key={t}
                icon="flow-end"
                text="Convert to Opportunity"
                intent="success"
                onClick={onConvert}
              />
            ) : (
              <MenuItem
                key={t}
                icon="arrow-right"
                text={STATUS_LABEL[t]}
                intent={t === 'DISQUALIFIED' ? 'danger' : undefined}
                onClick={() => onChange(t)}
              />
            ),
          )}
          {targets.length === 0 && <MenuDivider title="No further transitions" />}
        </Menu>
      }
    >
      <button
        type="button"
        disabled={targets.length === 0}
        className={cn(
          'inline-flex h-6 items-center gap-1.5 rounded-sm border px-2 text-[0.6875rem] font-medium uppercase tracking-[0.06em] transition-colors hover:bg-accent disabled:cursor-default disabled:hover:bg-transparent',
          TAG_CLASS[STATUS_VARIANT[status]],
          className,
        )}
      >
        {STATUS_LABEL[status]}
        {targets.length > 0 && <i className="bi bi-chevron-down text-[0.55rem] opacity-70" />}
      </button>
    </Popover>
  );
}

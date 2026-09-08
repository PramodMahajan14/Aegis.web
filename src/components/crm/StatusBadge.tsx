import { Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';
import { STATUS_LABEL, STATUS_TRANSITIONS, STATUS_VARIANT } from '../../crm/constants';
import type { ProspectStatus } from '../../crm/types';

const DOT_CLASS: Record<ProspectStatus, string> = {
  NEW: 'bg-muted-foreground',
  ACTIVE: 'bg-info',
  FOLLOW_UP: 'bg-warning',
  QUALIFICATION: 'bg-brand',
  QUALIFIED: 'bg-success',
  DORMANT: 'bg-muted-foreground',
  DISQUALIFIED: 'bg-danger',
  CONVERTED: 'bg-success',
};

export function StatusBadge({ status, className }: { status: ProspectStatus; className?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} dot className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

interface StatusMenuProps {
  status: ProspectStatus;
  onChange: (next: ProspectStatus) => void;
  onConvert?: () => void;
  className?: string;
}

/** Interactive status control — only offers transitions allowed by the
    state machine (blueprint §6, Figure 6). */
export function StatusMenu({ status, onChange, onConvert, className }: StatusMenuProps) {
  const targets = STATUS_TRANSITIONS[status];

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
          'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-0.5 pl-2 pr-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-100 disabled:hover:bg-surface',
          className,
        )}
      >
        <span className={cn('size-1.5 rounded-full', DOT_CLASS[status])} />
        {STATUS_LABEL[status]}
        {targets.length > 0 && <i className="bi bi-chevron-down text-[0.6rem] text-muted-foreground" />}
      </button>
    </Popover>
  );
}

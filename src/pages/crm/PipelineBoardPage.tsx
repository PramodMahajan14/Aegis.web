import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import { PageContainer } from '../../components/ui/PageContainer';
import { Button } from '../../components/ui/Button';
import { PersonAvatar } from '../../components/crm/PersonAvatar';
import { TemperaturePill } from '../../components/crm/TemperatureControl';
import { EmptyState } from '../../components/crm/EmptyState';
import { useComposers } from '../../components/crm/useComposers';
import { useProspects, useCrmActions } from '../../crm/hooks';
import { STATUS_LABEL, STATUS_TRANSITIONS } from '../../crm/constants';
import { formatMoney, isOverdue } from '../../crm/format';
import type { ProspectListItem } from '../../crm/hooks';
import type { ProspectStatus } from '../../crm/types';
import { cn } from '../../lib/cn';

const COLUMNS: { status: ProspectStatus; accent: string }[] = [
  { status: 'NEW', accent: 'bg-muted-foreground' },
  { status: 'ACTIVE', accent: 'bg-info' },
  { status: 'FOLLOW_UP', accent: 'bg-warning' },
  { status: 'QUALIFICATION', accent: 'bg-brand' },
  { status: 'QUALIFIED', accent: 'bg-success' },
  { status: 'CONVERTED', accent: 'bg-success' },
];

function ProspectCard({
  p,
  onMove,
  onConvert,
  onOpen,
}: {
  p: ProspectListItem;
  onMove: (id: string, to: ProspectStatus) => void;
  onConvert: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const targets = STATUS_TRANSITIONS[p.status];
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpen(p.id)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="truncate text-[0.8125rem] font-medium text-foreground">{p.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {p.prospectNo}
            {p.businessName ? ` · ${p.businessName}` : ''}
          </div>
        </button>
        {targets.length > 0 && (
          <Popover
            placement="bottom-end"
            content={
              <Menu>
                {targets.map((t) =>
                  t === 'CONVERTED' ? (
                    <MenuItem key={t} icon="flow-end" intent="success" text="Convert to Opportunity" onClick={() => onConvert(p.id)} />
                  ) : (
                    <MenuItem
                      key={t}
                      icon="arrow-right"
                      text={`Move to ${STATUS_LABEL[t]}`}
                      intent={t === 'DISQUALIFIED' ? 'danger' : undefined}
                      onClick={() => onMove(p.id, t)}
                    />
                  ),
                )}
              </Menu>
            }
          >
            <button
              type="button"
              className="grid size-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Move"
            >
              <i className="bi bi-three-dots-vertical text-xs" />
            </button>
          </Popover>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <TemperaturePill value={p.temperature} />
        {p.estimatedValue != null && (
          <span className="text-xs font-medium tabular-nums text-foreground">
            {formatMoney(p.estimatedValue)}
          </span>
        )}
      </div>

      {p.nextTask ? (
        <div
          className={cn(
            'mt-2 flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 text-xs',
            isOverdue(p.nextTask.dueAt) ? 'text-danger' : 'text-muted-foreground',
          )}
        >
          <i className="bi bi-check2-square" />
          <span className="truncate">{p.nextTask.title}</span>
        </div>
      ) : (
        <div className="mt-2 text-xs text-muted-foreground/70">No open task</div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <PersonAvatar name={p.ownerName} size="xs" />
          {p.ownerName.split(' ')[0]}
        </span>
        {p.projectProgress && (
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
            {p.projectProgress}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PipelineBoardPage() {
  const navigate = useNavigate();
  const composers = useComposers();
  const { changeStatus } = useCrmActions();
  const prospects = useProspects();

  const byStatus = useMemo(() => {
    const map = new Map<ProspectStatus, ProspectListItem[]>();
    for (const c of COLUMNS) map.set(c.status, []);
    for (const p of prospects) {
      if (map.has(p.status)) map.get(p.status)!.push(p);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0));
    }
    return map;
  }, [prospects]);

  const onMove = (id: string, to: ProspectStatus) => {
    if (to === 'DISQUALIFIED') composers.changeStatus(id, to);
    else changeStatus(id, to);
  };

  const totalValue = prospects
    .filter((p) => p.status !== 'CONVERTED' && p.status !== 'DISQUALIFIED' && p.status !== 'DORMANT')
    .reduce((s, p) => s + (p.estimatedValue ?? 0), 0);

  return (
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              <i className="bi bi-house-door" />
            </Link>
            <i className="bi bi-chevron-right text-[0.65rem] opacity-60" />
            <span className="font-medium text-foreground">Pipeline</span>
          </nav>
          <h1 className="mt-1.5 text-[1.4rem] font-semibold tracking-tight text-foreground">Pipeline board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {prospects.filter((p) => !['CONVERTED', 'DISQUALIFIED', 'DORMANT'].includes(p.status)).length}{' '}
            open prospects · {formatMoney(totalValue)} in play
          </p>
        </div>
        <Button size="sm" onClick={composers.newProspect}>
          <i className="bi bi-plus-lg" /> New prospect
        </Button>
      </div>

      {prospects.length === 0 ? (
        <EmptyState
          icon="bi-kanban"
          title="Pipeline is empty"
          description="Create a prospect to see it flow through the stages."
          action={
            <Button size="sm" onClick={composers.newProspect}>
              <i className="bi bi-plus-lg" /> New prospect
            </Button>
          }
        />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex min-w-max gap-3">
            {COLUMNS.map((col) => {
              const list = byStatus.get(col.status) ?? [];
              const sum = list.reduce((s, p) => s + (p.estimatedValue ?? 0), 0);
              return (
                <div key={col.status} className="flex w-72 shrink-0 flex-col">
                  <div className="sticky top-0 z-10 mb-2 flex items-center gap-2 rounded-lg border border-border bg-surface/90 px-3 py-2 backdrop-blur">
                    <span className={cn('size-2 rounded-full', col.accent)} />
                    <span className="text-[0.8125rem] font-semibold text-foreground">
                      {STATUS_LABEL[col.status]}
                    </span>
                    <span className="rounded-full bg-accent px-1.5 text-xs text-muted-foreground">
                      {list.length}
                    </span>
                    {sum > 0 && (
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {formatMoney(sum)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 rounded-lg bg-surface-2/60 p-2">
                    {list.map((p) => (
                      <ProspectCard
                        key={p.id}
                        p={p}
                        onMove={onMove}
                        onConvert={composers.convert}
                        onOpen={(id) => navigate(`/prospects/${id}`)}
                      />
                    ))}
                    {list.length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground/60">Empty</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

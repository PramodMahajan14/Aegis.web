import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Switch';
import { Spinner } from '../../components/ui/Spinner';
import { TableWrap, Table, THead, TBody, EmptyRow } from '../../components/ui/Table';
import {
  BulkBar,
  BulkBarButton,
  KpiStrip,
  Page,
  PageBar,
  PageContent,
  Block,
  PageTabs,
  PageToolbar,
  ToolbarSearch,
  denseHead,
  type Kpi,
} from '../../components/ui/Page';
import { PersonAvatar } from '../../components/crm/PersonAvatar';
import { EmptyState } from '../../components/crm/EmptyState';
import { useComposers } from '../../components/crm/useComposers';
import { TEMPERATURE_META } from '../../crm/constants';
import { formatDate, formatMoney, isOverdue } from '../../crm/format';
import type { Temperature } from '../../crm/types';
import type { Prospects } from '../../hooks/Prospect/ProspectType';
import { cn } from '../../lib/cn';
import { useProspectsList } from '../../hooks/Prospect/useProspect';

type ProspectRow = Prospects['data'][number];

type TabKey = 'ALL' | 'NEW' | 'HOT' | 'QUALIFIED' | 'OVERDUE';

const TABS: {
  key: TabKey;
  label: string;
  match: (p: ProspectRow) => boolean;
}[] = [
  { key: 'ALL', label: 'All', match: () => true },
  { key: 'NEW', label: 'New', match: (p) => p.status?.code === 'NEW' },
  { key: 'HOT', label: 'Hot', match: (p) => p.temperature?.code === 'HOT' },
  {
    key: 'QUALIFIED',
    label: 'Qualified',
    match: (p) => p.status?.code === 'QUALIFIED',
  },
  {
    key: 'OVERDUE',
    label: 'Overdue',
    match: (p) => !!p.nextAction?.date && isOverdue(p.nextAction.date),
  },
];

export default function ProspectsPage() {
  const { data, isPending } = useProspectsList();
  const navigate = useNavigate();
  const composers = useComposers();

  const [tab, setTab] = useState<TabKey>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const all = useMemo(() => data?.data ?? [], [data]);

  const counts = useMemo(
    () => Object.fromEntries(TABS.map((t) => [t.key, all.filter(t.match).length])) as Record<TabKey, number>,
    [all],
  );

  const rows = useMemo(() => {
    const match = TABS.find((t) => t.key === tab)!.match;
    const q = search.trim().toLowerCase();
    return all.filter(
      (p) =>
        match(p) &&
        (!q || [p.name, p.businessName, p.prospectNo, p.location].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [all, tab, search]);

  const kpis = useMemo(() => {
    const total = all.length;
    const value = all.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
    const withNext = all.filter((p) => p.nextAction?.date).length;
    return [
      {
        label: 'Total prospects',
        value: String(total),
        hint: 'in your workspace',
      },
      {
        label: 'Pipeline value',
        value: formatMoney(value),
        hint: 'estimated, all stages',
      },
      {
        label: 'Qualified',
        value: String(counts.QUALIFIED),
        share: total ? counts.QUALIFIED / total : 0,
      },
      {
        label: 'Hot prospects',
        value: String(counts.HOT),
        share: total ? counts.HOT / total : 0,
        tone: 'brand',
      },
      {
        label: 'Next action overdue',
        value: String(counts.OVERDUE),
        hint: `${withNext} with a next action`,
        tone: counts.OVERDUE ? 'danger' : undefined,
      },
    ] as Kpi[];
  }, [all, counts]);

  const visibleIds = rows.map((r) => r.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => (allVisibleSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  const loading = isPending && all.length === 0;

  return (
    <Page>
      <PageBar
        title="Prospects"
        count={all.length}
        actions={
          <Button variant="brand" size="sm" onClick={composers.newProspect}>
            <i className="bi bi-plus-lg" />
            New prospect
          </Button>
        }
      />

      <PageContent>
        <Block>
          <KpiStrip bare items={kpis} loading={loading} />
          <PageTabs
            tabs={TABS.map((t) => ({
              key: t.key,
              label: t.label,
              count: t.key === 'ALL' ? undefined : counts[t.key],
            }))}
            value={tab}
            onChange={setTab}
          />

          <PageToolbar>
            <ToolbarSearch value={search} onChange={setSearch} />
            <span className="text-xs text-muted-foreground tabular-nums">
              {rows.length} {rows.length === 1 ? 'result' : 'results'}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => exportCsv(rows)} disabled={rows.length === 0}>
                <i className="bi bi-cloud-arrow-down" />
                Export
              </Button>
              <Button variant="subtle" size="sm" onClick={composers.newProspect}>
                <i className="bi bi-plus-lg" />
                Add prospect
              </Button>
            </div>
          </PageToolbar>

          {/* Table */}
          {!isPending && all.length === 0 ? (
            <EmptyState
              icon="bi-folder-plus"
              title="No prospects yet"
              description="Create your first project pursuit to start capturing work."
              action={
                <Button variant="brand" size="sm" onClick={composers.newProspect}>
                  <i className="bi bi-plus-lg" /> New prospect
                </Button>
              }
            />
          ) : (
            <TableWrap>
              <Table>
                <THead className={denseHead}>
                  <tr>
                    <th className="w-10 !pl-5 !pr-0">
                      <Checkbox
                        className="accent-brand"
                        aria-label="Select all"
                        checked={allVisibleSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
                        }}
                        onChange={toggleAllVisible}
                      />
                    </th>
                    <th>Prospect</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Temperature</th>
                    <th className="!text-right">Est. value</th>
                    <th>Next action</th>
                    <th className="w-10" />
                  </tr>
                </THead>
                <TBody className="[&_td]:py-2 [&_tr]:border-border/70">
                  {loading && (
                    <EmptyRow colSpan={9}>
                      <Spinner className="mx-auto size-5" />
                    </EmptyRow>
                  )}
                  {rows.map((p) => {
                    const isSelected = selected.has(p.id);
                    return (
                      <tr
                        key={p.id}
                        className={cn(
                          'cursor-pointer',
                          isSelected && 'bg-brand-soft/60 hover:!bg-brand-soft',
                        )}
                        onClick={() => navigate(`/prospects/${p.id}`)}
                      >
                        <td className="!pl-5 !pr-0" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            className="accent-brand"
                            aria-label={`Select ${p.name}`}
                            checked={isSelected}
                            onChange={() => toggleRow(p.id)}
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <PersonAvatar name={p.name} size="xs" />
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">{p.name}</div>
                              <div className="text-[0.6875rem] text-muted-foreground">{p.prospectNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted-foreground">{p.businessName || '—'}</td>
                        <td className="text-muted-foreground">{p.location || '—'}</td>
                        <td>
                          <StatusTag name={p.status?.name} />
                        </td>
                        <td>
                          <TemperatureMeter code={p.temperature?.code as Temperature | undefined} />
                        </td>
                        <td className="text-right font-medium tabular-nums text-foreground">
                          {formatMoney(p.estimatedValue)}
                        </td>
                        <td>
                          {p.nextAction ? (
                            <div className="text-xs leading-tight">
                              <div className="truncate text-foreground">{p.nextAction.title}</div>
                              <div
                                className={cn(
                                  'text-muted-foreground',
                                  isOverdue(p.nextAction.date) && 'font-medium text-danger',
                                )}
                              >
                                {isOverdue(p.nextAction.date) ? 'Overdue · ' : ''}
                                {formatDate(p.nextAction.date)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="!pr-4" onClick={(e) => e.stopPropagation()}>
                          <Popover
                            placement="bottom-end"
                            content={
                              <Menu>
                                <MenuItem
                                  icon="document-open"
                                  text="Open"
                                  onClick={() => navigate(`/prospects/${p.id}`)}
                                />
                                <MenuItem icon="export" text="Export row" onClick={() => exportCsv([p])} />
                              </Menu>
                            }
                          >
                            <button
                              type="button"
                              aria-label="Row actions"
                              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <i className="bi bi-three-dots" />
                            </button>
                          </Popover>
                        </td>
                      </tr>
                    );
                  })}
                  {!loading && all.length > 0 && rows.length === 0 && (
                    <EmptyRow colSpan={9}>
                      <i className="bi bi-search mb-2 block text-2xl opacity-40" />
                      <p className="font-medium text-foreground">No prospects match</p>
                      <p className="text-sm">Try another tab or clear the search.</p>
                    </EmptyRow>
                  )}
                </TBody>
              </Table>
            </TableWrap>
          )}
        </Block>

        <BulkBar count={selected.size} onClear={() => setSelected(new Set())}>
          <BulkBarButton
            icon="bi-cloud-arrow-down"
            onClick={() => exportCsv(all.filter((p) => selected.has(p.id)))}
          >
            Export
          </BulkBarButton>
        </BulkBar>
      </PageContent>
    </Page>
  );
}

function StatusTag({ name }: { name?: string }) {
  if (!name) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="inline-flex rounded-sm border border-border-strong px-1.5 py-px text-[0.625rem] font-medium uppercase tracking-[0.06em] text-muted-foreground">
      {name}
    </span>
  );
}

const TEMP_LEVEL: Record<Temperature, number> = {
  NOT_SET: 0,
  COLD: 1,
  WARM: 2,
  HOT: 3,
};
const TEMP_BAR: Record<Temperature, string> = {
  NOT_SET: 'bg-muted',
  COLD: 'bg-info',
  WARM: 'bg-amber-400',
  HOT: 'bg-brand',
};

/** Segmented meter in place of the design's lead "score" bars. */
function TemperatureMeter({ code = 'NOT_SET' }: { code?: Temperature }) {
  const level = TEMP_LEVEL[code] ?? 0;
  const meta = TEMPERATURE_META[code] ?? TEMPERATURE_META.NOT_SET;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-[2px]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className={cn('h-3.5 w-[3px] rounded-[1px]', i < level * 3 ? TEMP_BAR[code] : 'bg-border-strong')}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">{meta.label}</span>
    </span>
  );
}

function exportCsv(rows: ProspectRow[]) {
  const header = [
    'Prospect No',
    'Name',
    'Company',
    'Location',
    'Status',
    'Temperature',
    'Estimated value',
    'Next action',
    'Next action date',
  ];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((p) =>
    [
      p.prospectNo,
      p.name,
      p.businessName,
      p.location,
      p.status?.name,
      p.temperature?.name,
      p.estimatedValue,
      p.nextAction?.title,
      p.nextAction?.date,
    ]
      .map(esc)
      .join(','),
  );
  const blob = new Blob([[header.map(esc).join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prospects-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

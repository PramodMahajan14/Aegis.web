import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { NativeSelect } from '../../components/ui/NativeSelect';
import { TableWrap, Table, THead, TBody, EmptyRow } from '../../components/ui/Table';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { TemperaturePill } from '../../components/crm/TemperatureControl';
import { PersonAvatar } from '../../components/crm/PersonAvatar';
import { EmptyState } from '../../components/crm/EmptyState';
import { useComposers } from '../../components/crm/useComposers';
import { useProspects } from '../../crm/hooks';
import { useCrmStore } from '../../crm/mockStore';
import { STATUS_LABEL, STATUS_ORDER } from '../../crm/constants';
import { formatDate, formatMoney, isOverdue, relativeTime } from '../../crm/format';
import type { ProspectStatus, Temperature } from '../../crm/types';
import { cn } from '../../lib/cn';
import { PageContainer } from '../../components/ui/PageContainer';
import { useProspectsList } from '../../hooks/Prospect/useProspect';

export default function ProspectsPage() {
  const { data, isPending } = useProspectsList()
  console.log(data)
  const navigate = useNavigate();
  const composers = useComposers();
  // const allProspects = useCrmStore((s) => s.prospects);

  // const [search, setSearch] = useState('');
  // const [status, setStatus] = useState<ProspectStatus | 'ALL' | 'ACTIVE_SET'>('ALL');
  // const [temperature, setTemperature] = useState<Temperature | 'ALL'>('ALL');

  // const rows = useProspects({ search, status, temperature });

  // const funnel = useMemo(() => {
  //   const counts = STATUS_ORDER.map((s) => ({
  //     status: s,
  //     count: allProspects.filter((p) => p.status === s).length,
  //   }));
  //   return counts.filter((c) => c.count > 0 || ['NEW', 'ACTIVE', 'QUALIFICATION', 'QUALIFIED'].includes(c.status));
  // }, [allProspects]);

  return (
    <PageContainer>
      <PageHeader
        crumbs={['Sales', 'Prospects']}
        description="Every project pursuit — before and after it becomes an opportunity."
        actions={
          <Button size="sm" onClick={composers.newProspect}>
            <i className="bi bi-plus-lg" />
            New prospect
          </Button>
        }
      />

      {/* Funnel strip */}
      {/* <div className="mb-4 flex flex-wrap gap-2">
        {funnel.map((f) => (
          <button
            key={f.status}
            type="button"
            onClick={() => setStatus((s) => (s === f.status ? 'ALL' : f.status))}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors',
              status === f.status
                ? 'border-brand bg-brand-soft'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            <span className="text-lg font-semibold tabular-nums text-foreground">{f.count}</span>
            <span className="text-xs text-muted-foreground">{STATUS_LABEL[f.status]}</span>
          </button>
        ))}
      </div> */}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <SearchInput
            placeholder="Search prospects…"
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
            wrapClassName="w-full max-w-xs"
          />
          {/* <NativeSelect
            className="h-9 w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProspectStatus | 'ALL' | 'ACTIVE_SET')}
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE_SET">Active working set</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </NativeSelect> */}
          {/* <NativeSelect
            className="h-9 w-auto"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value as Temperature | 'ALL')}
          >
            <option value="ALL">Any temperature</option>
            <option value="HOT">Hot</option>
            <option value="WARM">Warm</option>
            <option value="COLD">Cold</option>
          </NativeSelect> */}
          <span className="ml-auto text-xs text-muted-foreground">{data?.data.length} shown</span>
        </div>

        {data?.data.length === 0 && isPending ? (
          <EmptyState
            icon="bi-folder-plus"
            title="No prospects yet"
            description="Create your first project pursuit to start capturing work."
            action={
              <Button size="sm" onClick={composers.newProspect}>
                <i className="bi bi-plus-lg" /> New prospect
              </Button>
            }
          />
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  <th>Prospect</th>
                  <th>Status</th>
                  <th>Temp.</th>
                  <th>Est. value</th>
                  <th>Next action</th>
                  <th>Last activity</th>
                </tr>
              </THead>
              <TBody>
                {data?.data.map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/prospects/${p.id}`)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <PersonAvatar name={p.name} size="md" />
                        <div className="min-w-0">
                          <div className="font-medium text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.prospectNo}
                            {p.businessName ? ` · ${p.businessName}` : ''}
                            {p.location ? ` · ${p.location}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <TemperaturePill value={p.temperature} />
                    </td>
                    <td className="font-medium tabular-nums text-foreground">
                      {formatMoney(p.estimatedValue)}
                    </td>
                    <td>
                      {p?.nextAction ? (
                        <div className="text-xs">
                          {/* <div className="text-foreground">{p.nextTask.title}</div>
                          <div
                            className={cn(
                              'text-muted-foreground',
                              isOverdue(p.nextTask.dueAt) && 'font-medium text-danger',
                            )}
                          >
                            {isOverdue(p.nextTask.dueAt) ? 'Overdue · ' : ''}
                            {formatDate(p.nextTask.dueAt)}
                            {p.overdueTaskCount > 1 ? ` · +${p.overdueTaskCount - 1} overdue` : ''}
                          </div> */}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {/* {p.lastActivityAt ? relativeTime(p.lastActivityAt) : 'None'} */}
                    </td>
                  </tr>
                ))}
                {data?.data?.length === 0 && (
                  <EmptyRow colSpan={6}>
                    <i className="bi bi-search mb-2 block text-2xl opacity-40" />
                    <p className="font-medium text-foreground">No prospects match</p>
                    <p className="text-sm">Try clearing the filters.</p>
                  </EmptyRow>
                )}
              </TBody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </PageContainer>
  );
}

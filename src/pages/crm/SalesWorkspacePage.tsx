import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { TableWrap, Table, THead, TBody } from '../../components/ui/Table';
import {
  KpiStrip,
  Page,
  PageContent,
  PageBar,
  Section,
  SectionGrid,
  SectionLink,
  denseHead,
  type Kpi,
} from '../../components/ui/Page';
import { EmptyState } from '../../components/crm/EmptyState';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { TemperaturePill } from '../../components/crm/TemperatureControl';
import { PersonAvatar } from '../../components/crm/PersonAvatar';
import { TimelineFeed } from '../../components/crm/TimelineFeed';
import { TaskRow } from '../../components/crm/items';
import { ProspectPickerButton } from '../../components/crm/ProspectPickerButton';
import { FunnelChart, ValueBars, StackedBar, Sparkline } from '../../components/crm/charts';
import { useComposers } from '../../components/crm/useComposers';
import { useMyTasks, useProspects, useCrmActions } from '../../crm/hooks';
import { useCrmStore } from '../../crm/mockStore';
import { useDashboardMetrics } from '../../crm/dashboard';
import { CURRENT_USER } from '../../crm/env';
import { STATUS_LABEL } from '../../crm/constants';
import { formatMoney, isOverdue, isToday } from '../../crm/format';
import { cn } from '../../lib/cn';
import type { ProspectStatus, Temperature } from '../../crm/types';

const STAGE_TONE = {
  NEW: 'muted',
  ACTIVE: 'info',
  FOLLOW_UP: 'warning',
  QUALIFICATION: 'brand',
  QUALIFIED: 'success',
  CONVERTED: 'success',
} as const;

// The dashboard still reads the mock store (plain status/temperature codes);
// the shared badges take the API's { id, code, name } shape.
const asStatus = (code: ProspectStatus) => ({ id: code, code, name: STATUS_LABEL[code] });
const asTemp = (code?: Temperature) => (code ? { id: code, code, name: code } : undefined);

export default function SalesWorkspacePage() {
  const navigate = useNavigate();
  const composers = useComposers();
  const { completeTask } = useCrmActions();
  const prospects = useProspects();
  const tasks = useMyTasks();
  const timeline = useCrmStore((s) => s.timeline);
  const m = useDashboardMetrics();

  const firstName = CURRENT_USER.name.split(' ')[0];

  const kpis: Kpi[] = [
    {
      label: 'Working pipeline',
      value: formatMoney(m.money.pipelineValue),
      hint: `${formatMoney(m.money.weightedPipeline)} weighted`,
      extra: <Sparkline data={m.spark} className="mt-2 -mb-1" />,
    },
    { label: 'Won value', value: formatMoney(m.money.wonValue), hint: `${m.counts.won} converted` },
    { label: 'Active prospects', value: m.counts.active, hint: `${m.counts.qualified} qualified` },
    {
      label: 'Pending follow-ups',
      value: m.counts.openFollowUps,
      hint: m.counts.overdueTasks > 0 ? `${m.counts.overdueTasks} overdue` : 'on track',
      tone: m.counts.overdueTasks > 0 ? 'danger' : undefined,
    },
  ];

  const dueSoon = tasks
    .filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
    .filter((t) => isOverdue(t.dueAt) || isToday(t.dueAt));

  const myProspects = [...prospects]
    .sort((a, b) => {
      if (!!b.overdueTaskCount !== !!a.overdueTaskCount) return b.overdueTaskCount ? 1 : -1;
      return (b.lastActivityAt ?? '') < (a.lastActivityAt ?? '') ? -1 : 1;
    })
    .slice(0, 6);

  const effortItems = [
    { label: 'Calls', value: m.effort.calls, tone: 'info' as const },
    { label: 'Emails', value: m.effort.emails, tone: 'brand' as const },
    { label: 'Meetings', value: m.effort.meetings, tone: 'warning' as const },
    { label: 'Site visits', value: m.effort.visits, tone: 'success' as const },
    { label: 'Follow-ups done', value: m.effort.followUpsDone, tone: 'muted' as const },
  ];

  return (
    <Page>
      <PageBar
        title={`Good day, ${firstName}`}
        description="Capture the work — Aegis builds the pipeline, history and numbers."
        actions={
          <Button variant="brand" size="sm" onClick={composers.newProspect}>
            <i className="bi bi-plus-lg" /> New prospect
          </Button>
        }
      />

      {/* Quick capture */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface px-3.5 py-1.5">
        <span className="px-1.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
          Quick capture
        </span>
        <ProspectPickerButton
          variant="ghost"
          label="Log activity"
          icon="bi-chat-dots"
          onPick={composers.logActivity}
        />
        <ProspectPickerButton
          variant="ghost"
          label="Meeting"
          icon="bi-calendar-event"
          onPick={composers.scheduleMeeting}
        />
        <ProspectPickerButton
          variant="ghost"
          label="Site visit"
          icon="bi-geo-alt"
          onPick={composers.startSiteVisit}
        />
        <ProspectPickerButton
          variant="ghost"
          label="Contact"
          icon="bi-person-plus"
          onPick={(pid) => composers.addContact(undefined, pid)}
        />
        <ProspectPickerButton
          variant="ghost"
          label="Task"
          icon="bi-check2-square"
          onPick={composers.addTask}
        />
      </div>

      <PageContent>
        <SectionGrid className="lg:grid-cols-3">
          <div className="lg:col-span-3 [&>div]:border-b-0">
            <KpiStrip bare items={kpis} />
          </div>
          <Section
            className="lg:col-span-2"
            title="Prospect pipeline"
            action={<SectionLink to="/pipeline">Open board</SectionLink>}
          >
            <FunnelChart
              stages={m.funnel.map((f) => ({
                label: STATUS_LABEL[f.status],
                value: f.count,
                tone: STAGE_TONE[f.status as keyof typeof STAGE_TONE],
                hint: `${f.count} prospect(s) reached ${STATUS_LABEL[f.status]}`,
              }))}
            />
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
              <span>
                Conversion (qualified → won){' '}
                <b className="text-foreground tabular-nums">{m.conversionRate}%</b>
              </span>
              <span>
                Dormant <b className="text-foreground tabular-nums">{m.counts.dormant}</b>
              </span>
              <span>
                Disqualified <b className="text-foreground tabular-nums">{m.counts.lost}</b>
                {m.money.lostValue > 0 && ` · ${formatMoney(m.money.lostValue)}`}
              </span>
            </div>
          </Section>

          <Section title="Pipeline value by stage">
            <ValueBars
              items={m.funnel
                .filter((f) => f.status !== 'CONVERTED')
                .map((f) => {
                  const value = prospects
                    .filter((p) => p.status === f.status)
                    .reduce((s, p) => s + (p.estimatedValue ?? 0), 0);
                  return {
                    label: STATUS_LABEL[f.status],
                    value,
                    display: formatMoney(value),
                    tone: STAGE_TONE[f.status as keyof typeof STAGE_TONE],
                  };
                })}
            />
          </Section>

          <Section title="Effort · last 7 days">
            <ValueBars items={effortItems} />
          </Section>

          <Section title="Temperature mix">
            <StackedBar
              segments={[
                { label: 'Hot', value: m.temp.HOT, className: 'bg-danger', text: 'text-danger' },
                { label: 'Warm', value: m.temp.WARM, className: 'bg-warning', text: 'text-warning' },
                { label: 'Cold', value: m.temp.COLD, className: 'bg-info', text: 'text-info' },
              ]}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Across {m.counts.active} active prospects. Temperature is engagement heat — a separate dimension
              from status.
            </p>
          </Section>

          <Section title="Today & overdue" action={<SectionLink to="/planner">Planner</SectionLink>}>
            {dueSoon.length === 0 ? (
              <EmptyState icon="bi-emoji-smile" title="All clear" compact />
            ) : (
              <div className="-my-2 divide-y divide-border">
                {dueSoon.slice(0, 5).map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    onComplete={completeTask}
                    showProspect
                    onOpenProspect={(pid) => navigate(`/prospects/${pid}`)}
                  />
                ))}
              </div>
            )}
          </Section>

          <Section className="lg:col-span-2" title="Needs attention">
            {m.attention.length === 0 ? (
              <EmptyState
                icon="bi-shield-check"
                title="Nothing slipping"
                description="Every active prospect has a next step and recent activity."
                compact
              />
            ) : (
              <ul className="-my-1 divide-y divide-border">
                {m.attention.map(({ prospect: p, reason, severity }) => (
                  <li key={p.id}>
                    <Link
                      to={`/prospects/${p.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-accent/60"
                    >
                      <i
                        className={cn(
                          'bi shrink-0 text-[0.9rem]',
                          severity === 2
                            ? 'bi-exclamation-triangle text-danger'
                            : 'bi-hourglass-split text-warning',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[0.8125rem] font-medium text-foreground">
                            {p.name}
                          </span>
                          <TemperaturePill value={asTemp(p.temperature)} />
                        </div>
                        <div className="text-xs text-muted-foreground">{reason}</div>
                      </div>
                      <StatusBadge status={asStatus(p.status)} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Recent activity">
            <div className="max-h-[24rem] overflow-y-auto">
              <TimelineFeed events={timeline.slice(0, 14)} />
            </div>
          </Section>

          {/* My prospects */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <h2 className="text-[0.8125rem] font-semibold tracking-normal">My prospects</h2>
              <SectionLink to="/prospects">View all ({prospects.length})</SectionLink>
            </div>
            {myProspects.length === 0 ? (
              <EmptyState
                icon="bi-folder-plus"
                title="No prospects yet"
                action={
                  <Button variant="brand" size="sm" onClick={composers.newProspect}>
                    <i className="bi bi-plus-lg" /> New prospect
                  </Button>
                }
              />
            ) : (
              <TableWrap className="pb-4">
                <Table>
                  <THead className={denseHead}>
                    <tr>
                      <th className="!pl-5">Prospect</th>
                      <th>Next step</th>
                      <th className="!text-right">Est. value</th>
                      <th className="!pr-5">Status</th>
                    </tr>
                  </THead>
                  <TBody className="[&_td]:py-2 [&_tr]:border-border/70">
                    {myProspects.map((p) => (
                      <tr
                        key={p.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/prospects/${p.id}`)}
                      >
                        <td className="!pl-5">
                          <div className="flex items-center gap-2.5">
                            <PersonAvatar name={p.name} size="xs" />
                            <span className="truncate font-medium text-foreground">{p.name}</span>
                            <TemperaturePill value={asTemp(p.temperature)} />
                          </div>
                        </td>
                        <td className="text-xs text-muted-foreground">
                          {p.nextTask ? p.nextTask.title : 'No open task'}
                          {p.overdueTaskCount > 0 && (
                            <span className="ml-1.5 font-medium text-danger">
                              · {p.overdueTaskCount} overdue
                            </span>
                          )}
                        </td>
                        <td className="text-right font-medium tabular-nums">
                          {formatMoney(p.estimatedValue)}
                        </td>
                        <td className="!pr-5">
                          <StatusBadge status={asStatus(p.status)} />
                        </td>
                      </tr>
                    ))}
                  </TBody>
                </Table>
              </TableWrap>
            )}
          </div>
        </SectionGrid>
      </PageContent>
    </Page>
  );
}

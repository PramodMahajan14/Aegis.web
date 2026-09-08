import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageContainer } from '../../components/ui/PageContainer';
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

const STAGE_TONE = {
  NEW: 'muted',
  ACTIVE: 'info',
  FOLLOW_UP: 'warning',
  QUALIFICATION: 'brand',
  QUALIFIED: 'success',
  CONVERTED: 'success',
} as const;

function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h3 className="text-[0.9375rem] font-semibold">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

export default function SalesWorkspacePage() {
  const navigate = useNavigate();
  const composers = useComposers();
  const { completeTask } = useCrmActions();
  const prospects = useProspects();
  const tasks = useMyTasks();
  const timeline = useCrmStore((s) => s.timeline);
  const m = useDashboardMetrics();

  const firstName = CURRENT_USER.name.split(' ')[0];

  const kpis = [
    {
      label: 'Working pipeline',
      value: formatMoney(m.money.pipelineValue),
      sub: `${formatMoney(m.money.weightedPipeline)} weighted`,
      spark: true,
    },
    {
      label: 'Won value',
      value: formatMoney(m.money.wonValue),
      sub: `${m.counts.converted} converted`,
    },
    {
      label: 'Active prospects',
      value: m.counts.active,
      sub: `${m.counts.qualified} qualified`,
    },
    {
      label: 'Pending follow-ups',
      value: m.counts.openFollowUps,
      sub: m.counts.overdueTasks > 0 ? `${m.counts.overdueTasks} overdue` : 'on track',
      danger: m.counts.overdueTasks > 0,
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
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-foreground">
            Good day, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture the work — Aegis builds the pipeline, history and numbers.
          </p>
        </div>
        <Button size="sm" onClick={composers.newProspect}>
          <i className="bi bi-plus-lg" /> New prospect
        </Button>
      </div>

      {/* Quick capture */}
      <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <button
          type="button"
          onClick={composers.newProspect}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-brand bg-brand-soft px-3 py-3.5 text-[0.8125rem] font-medium text-brand-stronger transition hover:brightness-95"
        >
          <i className="bi bi-folder-plus text-lg" />
          New prospect
        </button>
        <ProspectPickerButton label="Log activity" icon="bi-chat-dots" onPick={composers.logActivity} />
        <ProspectPickerButton label="New meeting" icon="bi-calendar-event" onPick={composers.scheduleMeeting} />
        <ProspectPickerButton label="Site visit" icon="bi-geo-alt" onPick={composers.startSiteVisit} />
        <ProspectPickerButton label="Add contact" icon="bi-person-plus" onPick={composers.addContact} />
        <ProspectPickerButton label="Add task" icon="bi-check2-square" onPick={composers.addTask} />
      </div>

      {/* KPI band */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="overflow-hidden p-4">
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
              {k.label}
            </div>
            <div className="mt-1.5 text-[1.6rem] font-semibold leading-none tracking-tight tabular-nums text-foreground">
              {k.value}
            </div>
            <div
              className={cn(
                'mt-1.5 text-xs',
                k.danger ? 'font-medium text-danger' : 'text-muted-foreground',
              )}
            >
              {k.sub}
            </div>
            {k.spark && <Sparkline data={m.spark} className="mt-2 -mb-1" />}
          </Card>
        ))}
      </div>

      {/* Pipeline row */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Prospect pipeline"
          action={
            <Link to="/pipeline" className="text-xs font-medium text-brand-strong hover:underline">
              Open board
            </Link>
          }
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
              Disqualified <b className="text-foreground tabular-nums">{m.counts.disqualified}</b>
              {m.money.lostValue > 0 && ` · ${formatMoney(m.money.lostValue)}`}
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Pipeline value by stage">
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
        </SectionCard>
      </div>

      {/* Metrics row */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Effort · last 7 days">
          <ValueBars items={effortItems} />
        </SectionCard>

        <SectionCard title="Temperature mix">
          <StackedBar
            segments={[
              { label: 'Hot', value: m.temp.HOT, className: 'bg-danger', text: 'text-danger' },
              { label: 'Warm', value: m.temp.WARM, className: 'bg-warning', text: 'text-warning' },
              { label: 'Cold', value: m.temp.COLD, className: 'bg-info', text: 'text-info' },
            ]}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Across {m.counts.active} active prospects. Temperature is engagement heat — a separate
            dimension from status.
          </p>
        </SectionCard>

        <SectionCard title="Today &amp; overdue" action={
          <Link to="/planner" className="text-xs font-medium text-brand-strong hover:underline">
            Planner
          </Link>
        }>
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
        </SectionCard>
      </div>

      {/* Attention + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Needs attention">
          {m.attention.length === 0 ? (
            <EmptyState icon="bi-shield-check" title="Nothing slipping" description="Every active prospect has a next step and recent activity." compact />
          ) : (
            <ul className="-my-2 divide-y divide-border">
              {m.attention.map(({ prospect: p, reason, severity }) => (
                <li key={p.id}>
                  <Link
                    to={`/prospects/${p.id}`}
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50"
                  >
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-full text-[0.8rem]',
                        severity === 2 ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning',
                      )}
                    >
                      <i className={severity === 2 ? 'bi bi-exclamation-triangle' : 'bi bi-hourglass-split'} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[0.8125rem] font-medium text-foreground">
                          {p.name}
                        </span>
                        <TemperaturePill value={p.temperature} />
                      </div>
                      <div className="text-xs text-muted-foreground">{reason}</div>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent activity">
          <div className="max-h-[24rem] overflow-y-auto">
            <TimelineFeed events={timeline.slice(0, 14)} />
          </div>
        </SectionCard>
      </div>

      {/* My prospects */}
      <Card className="mt-4">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-[0.9375rem] font-semibold">My prospects</h3>
          <Link to="/prospects" className="text-xs font-medium text-brand-strong hover:underline">
            View all ({prospects.length})
          </Link>
        </div>
        {myProspects.length === 0 ? (
          <EmptyState
            icon="bi-folder-plus"
            title="No prospects yet"
            action={
              <Button size="sm" onClick={composers.newProspect}>
                <i className="bi bi-plus-lg" /> New prospect
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {myProspects.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/prospects/${p.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/50"
                >
                  <PersonAvatar name={p.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[0.8125rem] font-medium text-foreground">
                        {p.name}
                      </span>
                      <TemperaturePill value={p.temperature} />
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {p.nextTask ? `Next: ${p.nextTask.title}` : 'No open task'}
                      {p.overdueTaskCount > 0 && (
                        <span className="ml-1.5 font-medium text-danger">· {p.overdueTaskCount} overdue</span>
                      )}
                    </div>
                  </div>
                  <span className="hidden text-[0.8125rem] font-medium tabular-nums text-muted-foreground sm:block">
                    {formatMoney(p.estimatedValue)}
                  </span>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PageContainer>
  );
}

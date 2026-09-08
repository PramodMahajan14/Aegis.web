import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard, ChartTooltip, GaugeBar, KpiTile, SERIES, axisProps, CHART } from './widgets';
import { FunnelChart } from '../charts';
import { EmptyState } from '../EmptyState';
import { PersonAvatar } from '../PersonAvatar';
import { StatusBadge } from '../StatusBadge';
import { TemperaturePill } from '../TemperatureControl';
import { TimelineFeed } from '../TimelineFeed';
import { TaskRow } from '../items';
import { useDashboardMetrics } from '../../../crm/dashboard';
import { useCrmStore } from '../../../crm/mockStore';
import { useMyTasks, useCrmActions } from '../../../crm/hooks';
import { CURRENT_USER } from '../../../crm/env';
import { STATUS_LABEL } from '../../../crm/constants';
import { formatMoney, isOverdue, isToday } from '../../../crm/format';
import type { ProspectStatus } from '../../../crm/types';

const money = (v: number | string) => formatMoney(Number(v));
const STAGE_TONE: Record<string, 'muted' | 'info' | 'warning' | 'brand' | 'success'> = {
  NEW: 'muted',
  ACTIVE: 'info',
  FOLLOW_UP: 'warning',
  QUALIFICATION: 'brand',
  QUALIFIED: 'success',
  CONVERTED: 'success',
};

function funnelStages(funnel: { status: ProspectStatus; count: number }[]) {
  return funnel.map((f) => ({
    label: STATUS_LABEL[f.status],
    value: f.count,
    tone: STAGE_TONE[f.status],
    hint: `${f.count} reached ${STATUS_LABEL[f.status]}`,
  }));
}

function Donut({
  data,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <EmptyState icon="bi-pie-chart" title="No data" compact />;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {centerValue ?? total}
          </span>
          {centerLabel && <span className="text-[0.65rem] text-muted-foreground">{centerLabel}</span>}
        </div>
      </div>
      <ul className="flex-1 space-y-1.5">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-[0.8125rem]">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-foreground">{d.value}</span>
            <span className="w-10 text-right text-xs text-muted-foreground">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RankBars({
  data,
  valueKey,
  labelKey,
  format,
  color = CHART.brand,
}: {
  data: Record<string, string | number>[];
  valueKey: string;
  labelKey: string;
  format?: (v: number) => string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(140, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={CHART.grid} />
        <XAxis type="number" {...axisProps} tickFormatter={(v) => (format ? format(v) : String(v))} />
        <YAxis type="category" dataKey={labelKey} width={110} {...axisProps} />
        <Tooltip
          cursor={{ fill: 'var(--accent)' }}
          content={<ChartTooltip formatter={(v) => (format ? format(Number(v)) : String(v))} />}
        />
        <Bar dataKey={valueKey} fill={color} radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TempDonut({ temp }: { temp: { HOT: number; WARM: number; COLD: number } }) {
  return (
    <Donut
      centerLabel="active"
      data={[
        { name: 'Hot', value: temp.HOT, color: 'var(--danger)' },
        { name: 'Warm', value: temp.WARM, color: 'var(--warning)' },
        { name: 'Cold', value: temp.COLD, color: 'var(--info)' },
      ]}
    />
  );
}

function TopDeals({ deals }: { deals: ReturnType<typeof useDashboardMetrics>['topDeals'] }) {
  if (deals.length === 0) return <EmptyState icon="bi-trophy" title="No open deals" compact />;
  return (
    <ul className="-my-2 divide-y divide-border">
      {deals.map((p) => (
        <li key={p.id}>
          <Link
            to={`/prospects/${p.id}`}
            className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent/50"
          >
            <PersonAvatar name={p.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.8125rem] font-medium text-foreground">{p.name}</div>
              <div className="text-xs text-muted-foreground">
                {p.ownerName.split(' ')[0]} · {p.source}
              </div>
            </div>
            <span className="text-[0.8125rem] font-semibold tabular-nums text-foreground">
              {formatMoney(p.estimatedValue)}
            </span>
            <StatusBadge status={p.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AttentionList({ items }: { items: ReturnType<typeof useDashboardMetrics>['attention'] }) {
  if (items.length === 0)
    return <EmptyState icon="bi-shield-check" title="Nothing slipping" compact />;
  return (
    <ul className="-my-2 divide-y divide-border">
      {items.map(({ prospect: p, reason, severity }) => (
        <li key={p.id}>
          <Link
            to={`/prospects/${p.id}`}
            className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent/50"
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-[0.8rem] ${
                severity === 2 ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'
              }`}
            >
              <i className={severity === 2 ? 'bi bi-exclamation-triangle' : 'bi bi-hourglass-split'} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[0.8125rem] font-medium text-foreground">{p.name}</span>
                <TemperaturePill value={p.temperature} />
              </div>
              <div className="text-xs text-muted-foreground">
                {reason} · {p.ownerName.split(' ')[0]}
              </div>
            </div>
            <StatusBadge status={p.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ================================================================ SALES */

export function SalesDashboard() {
  const m = useDashboardMetrics(CURRENT_USER.employeeId);
  const tasks = useMyTasks();
  const { completeTask } = useCrmActions();
  const myTimeline = useCrmStore((s) => s.timeline);

  const dueSoon = tasks
    .filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
    .filter((t) => isOverdue(t.dueAt) || isToday(t.dueAt));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiTile label="Working pipeline" value={formatMoney(m.money.pipelineValue)} delta={`${formatMoney(m.money.weightedPipeline)} weighted`} spark={m.spark} />
        <KpiTile label="Won value" value={formatMoney(m.money.wonValue)} delta={`${m.counts.won} won`} deltaTone="up" icon="bi-trophy" />
        <KpiTile label="Win rate" value={`${m.winRate}%`} delta={`${m.counts.won}W · ${m.counts.lost}L`} icon="bi-percent" />
        <KpiTile label="Active prospects" value={m.counts.active} delta={`${m.counts.qualified} qualified`} icon="bi-folder" />
        <KpiTile
          label="Pending follow-ups"
          value={m.counts.openFollowUps}
          delta={m.counts.overdueTasks ? `${m.counts.overdueTasks} overdue` : 'on track'}
          deltaTone={m.counts.overdueTasks ? 'down' : 'flat'}
          icon="bi-arrow-repeat"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="My prospect funnel" subtitle="Stage reached — conversion between stages on the right">
          <FunnelChart stages={funnelStages(m.funnel)} />
        </ChartCard>
        <ChartCard title="Pipeline value by stage">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={m.valueByStage.map((v) => ({ name: STATUS_LABEL[v.status], value: v.value }))}>
              <CartesianGrid vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="name" {...axisProps} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis {...axisProps} tickFormatter={money} width={54} />
              <Tooltip cursor={{ fill: 'var(--accent)' }} content={<ChartTooltip formatter={money} />} />
              <Bar dataKey="value" fill={CHART.brand} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="My effort · last 7 days">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: 'Calls', value: m.effort.calls },
                { name: 'Emails', value: m.effort.emails },
                { name: 'Meetings', value: m.effort.meetings },
                { name: 'Visits', value: m.effort.visits },
                { name: 'Follow-ups', value: m.effort.followUpsDone },
              ]}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <CartesianGrid horizontal={false} stroke={CHART.grid} />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={72} {...axisProps} />
              <Tooltip cursor={{ fill: 'var(--accent)' }} content={<ChartTooltip />} />
              <Bar dataKey="value" fill={CHART.info} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Temperature mix">
          <TempDonut temp={m.temp} />
        </ChartCard>

        <ChartCard title="Today & overdue" action={<Link to="/planner" className="text-xs font-medium text-brand-strong hover:underline">Planner</Link>}>
          {dueSoon.length === 0 ? (
            <EmptyState icon="bi-emoji-smile" title="All clear" compact />
          ) : (
            <div className="-my-2 divide-y divide-border">
              {dueSoon.slice(0, 5).map((t) => (
                <TaskRow key={t.id} task={t} onComplete={completeTask} showProspect />
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Needs attention">
          <AttentionList items={m.attention} />
        </ChartCard>
        <ChartCard title="Recent activity">
          <div className="max-h-[22rem] overflow-y-auto">
            <TimelineFeed events={myTimeline.slice(0, 14)} />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

/* ============================================================ MARKETING */

export function MarketingDashboard() {
  const m = useDashboardMetrics();
  const found = m.bySource.reduce((s, x) => s + x.found, 0);
  const qualified = m.bySource.reduce((s, x) => s + x.qualified, 0);
  const wonAll = m.bySource.reduce((s, x) => s + x.won, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Prospects found" value={found} delta="all sources · 6 mo" icon="bi-broadcast" />
        <KpiTile label="Qualified" value={qualified} delta={`${found ? Math.round((qualified / found) * 100) : 0}% qualification rate`} icon="bi-patch-check" />
        <KpiTile label="Lead → Won" value={`${found ? Math.round((wonAll / found) * 100) : 0}%`} delta={`${wonAll} won from ${found}`} deltaTone="up" icon="bi-trophy" />
        <KpiTile label="Active in market" value={m.counts.active} delta={`${m.counts.qualified} qualified now`} icon="bi-folder" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Leads by source" subtitle="Found → qualified → won for each channel">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={m.bySource} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="source" {...axisProps} interval={0} angle={-20} textAnchor="end" height={64} />
              <YAxis {...axisProps} allowDecimals={false} width={32} />
              <Tooltip cursor={{ fill: 'var(--accent)' }} content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="found" name="Found" fill={SERIES[7]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="qualified" name="Qualified" fill={CHART.brand} radius={[3, 3, 0, 0]} />
              <Bar dataKey="won" name="Won" fill={CHART.success} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Source quality" subtitle="Won value by channel">
          <RankBars
            data={m.bySource.filter((s) => s.value > 0).map((s) => ({ source: s.source, value: s.value }))}
            valueKey="value"
            labelKey="source"
            format={formatMoney}
            color={CHART.success}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Lead flow" subtitle="New prospects vs qualified, by month">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={m.trend} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="created" name="New" stroke={CHART.brand} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="qualified" name="Qualified" stroke={CHART.success} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Funnel (all reps)">
          <FunnelChart stages={funnelStages(m.funnel)} />
        </ChartCard>
      </div>
    </div>
  );
}

/* ============================================================== MANAGER */

export function ManagerDashboard() {
  const m = useDashboardMetrics();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiTile label="Team pipeline" value={formatMoney(m.money.pipelineValue)} delta={`${formatMoney(m.money.weightedPipeline)} weighted`} icon="bi-cash-stack" />
        <KpiTile label="Open follow-ups" value={m.counts.openFollowUps} delta={`${m.counts.overdueTasks} overdue`} deltaTone={m.counts.overdueTasks ? 'down' : 'flat'} icon="bi-arrow-repeat" />
        <KpiTile label="Qualified now" value={m.counts.qualified} icon="bi-patch-check" />
        <KpiTile label="Win rate" value={`${m.winRate}%`} delta={`${m.counts.won}W · ${m.counts.lost}L`} icon="bi-percent" />
        <KpiTile label="Avg won size" value={formatMoney(m.money.avgWonSize)} icon="bi-rulers" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Rep leaderboard" subtitle="Won value this quarter">
          <RankBars
            data={m.byOwner.map((o) => ({ owner: o.owner, value: o.wonValue }))}
            valueKey="value"
            labelKey="owner"
            format={formatMoney}
            color={CHART.success}
          />
        </ChartCard>
        <ChartCard title="Target attainment" subtitle="Won value vs quarterly target">
          <div className="space-y-3">
            {m.byOwner.map((o) => (
              <GaugeBar
                key={o.employeeId}
                label={o.owner}
                pct={o.attainment}
                hint={`${formatMoney(o.wonValue)} of ${formatMoney(o.target)}`}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Stage bottlenecks" subtitle="Avg days a prospect sits in each open stage">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={m.stageAging.map((s) => ({ name: STATUS_LABEL[s.status], days: s.avgDays, count: s.count }))}
              layout="vertical"
              margin={{ left: 10, right: 24 }}
            >
              <CartesianGrid horizontal={false} stroke={CHART.grid} />
              <XAxis type="number" {...axisProps} tickFormatter={(v) => `${v}d`} />
              <YAxis type="category" dataKey="name" width={92} {...axisProps} />
              <Tooltip cursor={{ fill: 'var(--accent)' }} content={<ChartTooltip formatter={(v, n) => (n === 'days' ? `${v} days` : String(v))} />} />
              <Bar dataKey="days" name="days" fill={CHART.warning} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Activity by rep" subtitle="Logged interactions · last 30 days">
          <RankBars
            data={m.byOwner.map((o) => ({ owner: o.owner, value: o.activities }))}
            valueKey="value"
            labelKey="owner"
            color={CHART.info}
          />
        </ChartCard>

        <ChartCard title="Team funnel">
          <FunnelChart stages={funnelStages(m.funnel)} />
        </ChartCard>
      </div>

      <ChartCard title="Needs attention · whole team">
        <AttentionList items={m.attention} />
      </ChartCard>
    </div>
  );
}

/* ============================================================= DIRECTOR */

export function DirectorDashboard() {
  const m = useDashboardMetrics();
  const cumulative = (() => {
    let run = 0;
    return m.trend.map((t) => {
      run += t.won;
      return { ...t, cumWon: run };
    });
  })();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <KpiTile label="Won value" value={formatMoney(m.money.wonValue)} delta={`${m.counts.won} deals`} deltaTone="up" spark={m.spark} />
        <KpiTile label="Win rate" value={`${m.winRate}%`} delta={`${m.counts.won}W · ${m.counts.lost}L`} icon="bi-percent" />
        <KpiTile label="Lost value" value={formatMoney(m.money.lostValue)} delta={`${m.counts.lost} lost`} deltaTone="down" icon="bi-x-octagon" />
        <KpiTile label="Weighted pipeline" value={formatMoney(m.money.weightedPipeline)} delta={`${formatMoney(m.money.pipelineValue)} gross`} icon="bi-graph-up-arrow" />
        <KpiTile label="Conversion" value={`${m.conversionRate}%`} delta="qualified → won" icon="bi-funnel" />
        <KpiTile label="Avg won size" value={formatMoney(m.money.avgWonSize)} icon="bi-rulers" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Won vs lost" subtitle="Deals decided each month, with cumulative wins">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={cumulative} margin={{ left: 4, right: 8 }}>
              <CartesianGrid vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="won" name="Won" fill={CHART.success} radius={[3, 3, 0, 0]} barSize={22} />
              <Bar dataKey="lost" name="Lost" fill={CHART.danger} radius={[3, 3, 0, 0]} barSize={22} />
              <Line type="monotone" dataKey="cumWon" name="Cumulative wins" stroke={CHART.brand} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Win / loss" subtitle="Decided prospects">
          <Donut
            centerLabel="win rate"
            centerValue={`${m.winRate}%`}
            data={[
              { name: 'Won', value: m.counts.won, color: 'var(--success)' },
              { name: 'Lost', value: m.counts.lost, color: 'var(--danger)' },
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Why we lose" subtitle="Standardised loss reasons — count and value at risk">
          {m.lossReasons.length === 0 ? (
            <EmptyState icon="bi-emoji-smile" title="No losses recorded" compact />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(160, m.lossReasons.length * 46)}>
              <BarChart data={m.lossReasons} layout="vertical" margin={{ left: 8, right: 60 }}>
                <CartesianGrid horizontal={false} stroke={CHART.grid} />
                <XAxis type="number" {...axisProps} allowDecimals={false} />
                <YAxis type="category" dataKey="reason" width={150} {...axisProps} />
                <Tooltip
                  cursor={{ fill: 'var(--accent)' }}
                  content={<ChartTooltip formatter={(v, n) => (n === 'value' ? formatMoney(Number(v)) : String(v))} />}
                />
                <Bar dataKey="count" name="count" fill={CHART.danger} radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Pipeline health" subtitle="Open value by stage">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={m.valueByStage.map((v) => ({ name: STATUS_LABEL[v.status], value: v.value }))}>
              <CartesianGrid vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="name" {...axisProps} interval={0} angle={-20} textAnchor="end" height={54} />
              <YAxis {...axisProps} tickFormatter={money} width={54} />
              <Tooltip cursor={{ fill: 'var(--accent)' }} content={<ChartTooltip formatter={money} />} />
              <Bar dataKey="value" fill={CHART.brand} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue by rep" subtitle="Won value">
          <RankBars data={m.byOwner.map((o) => ({ owner: o.owner, value: o.wonValue }))} valueKey="value" labelKey="owner" format={formatMoney} color={CHART.success} />
        </ChartCard>
        <ChartCard title="Won value by source">
          <RankBars data={m.bySource.filter((s) => s.value > 0).map((s) => ({ source: s.source, value: s.value }))} valueKey="value" labelKey="source" format={formatMoney} color={CHART.brand} />
        </ChartCard>
        <ChartCard title="Top open deals">
          <TopDeals deals={m.topDeals} />
        </ChartCard>
      </div>
    </div>
  );
}

/* Area is imported for future use; keep bundlers from tree-shaking a needed dep. */
void Area;

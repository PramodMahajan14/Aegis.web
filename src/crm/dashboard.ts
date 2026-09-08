/* =========================================================================
   Dashboard / funnel metrics — everything derived from normalized records
   (blueprint §18, §23), never typed totals. `useDashboardMetrics(ownerId)`
   scopes to one salesperson; omit it for the team-wide management views.
   ========================================================================= */

import { useMemo } from 'react';
import { useCrmStore } from './mockStore';
import { ACTIVE_STATUSES } from './constants';
import type { Prospect, ProspectStatus } from './types';

const FUNNEL_STAGES: ProspectStatus[] = [
  'NEW',
  'ACTIVE',
  'FOLLOW_UP',
  'QUALIFICATION',
  'QUALIFIED',
  'CONVERTED',
];

const STAGE_WEIGHT: Partial<Record<ProspectStatus, number>> = {
  NEW: 0.05,
  ACTIVE: 0.15,
  FOLLOW_UP: 0.3,
  QUALIFICATION: 0.5,
  QUALIFIED: 0.75,
};

const DAY = 86_400_000;
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export function useDashboardMetrics(ownerEmployeeId?: string) {
  const store = useCrmStore();

  return useMemo(() => {
    const now = Date.now();

    const prospects = ownerEmployeeId
      ? store.prospects.filter((p) => p.ownerEmployeeId === ownerEmployeeId)
      : store.prospects;
    const mine = new Set(prospects.map((p) => p.id));
    const scoped = <T extends { prospectId: string }>(rows: T[]) =>
      ownerEmployeeId ? rows.filter((r) => mine.has(r.prospectId)) : rows;

    const statusHistory = scoped(store.statusHistory);
    const activities = scoped(store.activities);
    const meetings = scoped(store.meetings);
    const siteVisits = scoped(store.siteVisits);
    const tasks = scoped(store.tasks);

    const weekAgo = now - 7 * DAY;
    const monthAgo = now - 30 * DAY;
    const inWeek = (iso: string) => new Date(iso).getTime() >= weekAgo;
    const inMonth = (iso: string) => new Date(iso).getTime() >= monthAgo;

    // ---- Funnel: "ever reached stage" -----------------------------------
    const reached: Record<ProspectStatus, Set<string>> = {} as never;
    for (const s of FUNNEL_STAGES) reached[s] = new Set();
    for (const h of statusHistory as { prospectId: string; toStatus: ProspectStatus }[]) {
      if (reached[h.toStatus]) reached[h.toStatus].add(h.prospectId);
    }
    for (const p of prospects) {
      const idx = FUNNEL_STAGES.indexOf(p.status);
      for (let i = 0; i <= idx; i++) reached[FUNNEL_STAGES[i]].add(p.id);
    }
    const funnel = FUNNEL_STAGES.map((s) => ({ status: s, count: reached[s].size }));

    // ---- Buckets -------------------------------------------------------
    const by = (s: ProspectStatus) => prospects.filter((p) => p.status === s);
    const active = prospects.filter((p) => ACTIVE_STATUSES.includes(p.status));
    const openPipeline = active.filter((p) => p.status !== 'CONVERTED');
    const won = by('CONVERTED');
    const lost = by('DISQUALIFIED');
    const dormant = by('DORMANT');

    const sum = (arr: Prospect[]) => arr.reduce((s, p) => s + (p.estimatedValue ?? 0), 0);
    const pipelineValue = sum(openPipeline);
    const weightedPipeline = openPipeline.reduce(
      (s, p) => s + (p.estimatedValue ?? 0) * (STAGE_WEIGHT[p.status] ?? 0),
      0,
    );
    const wonValue = sum(won);
    const lostValue = sum(lost);

    const decided = won.length + lost.length;
    const winRate = decided > 0 ? Math.round((won.length / decided) * 100) : 0;
    const qualifiedEver = reached.QUALIFIED.size;
    const conversionRate = qualifiedEver > 0 ? Math.round((won.length / qualifiedEver) * 100) : 0;
    const avgWonSize = won.length ? Math.round(wonValue / won.length) : 0;

    // ---- Value by stage ----------------------------------------------
    const valueByStage = FUNNEL_STAGES.filter((s) => s !== 'CONVERTED').map((s) => ({
      status: s,
      value: sum(by(s)),
    }));

    // ---- Effort / activity ------------------------------------------
    const A = activities as { type: string; occurredAt: string }[];
    const effort = {
      calls: A.filter((a) => a.type === 'CALL' && inWeek(a.occurredAt)).length,
      emails: A.filter((a) => a.type === 'EMAIL' && inWeek(a.occurredAt)).length,
      meetings: (meetings as { createdAt: string }[]).filter((m) => inWeek(m.createdAt)).length,
      visits: (siteVisits as { completed: boolean; visitAt: string }[]).filter(
        (v) => v.completed && inWeek(v.visitAt),
      ).length,
      followUpsDone: (tasks as { type: string; status: string; completedAt?: string }[]).filter(
        (t) => t.type === 'FOLLOW_UP' && t.status === 'COMPLETED' && t.completedAt && inWeek(t.completedAt),
      ).length,
    };
    const activityMix = (['CALL', 'EMAIL', 'NOTE', 'CUSTOM'] as const).map((type) => ({
      type,
      count: A.filter((a) => a.type === type && inMonth(a.occurredAt)).length,
    }));

    const openFollowUps = (tasks as { type: string; status: string }[]).filter(
      (t) => t.type === 'FOLLOW_UP' && (t.status === 'OPEN' || t.status === 'IN_PROGRESS'),
    ).length;
    const overdueTasks = (tasks as { status: string; dueAt: string }[]).filter(
      (t) => (t.status === 'OPEN' || t.status === 'IN_PROGRESS') && new Date(t.dueAt).getTime() < now,
    ).length;

    // ---- Temperature (active) --------------------------------------
    const temp = {
      HOT: active.filter((p) => p.temperature === 'HOT').length,
      WARM: active.filter((p) => p.temperature === 'WARM').length,
      COLD: active.filter((p) => p.temperature === 'COLD').length,
    };

    // ---- By source (lead generation — marketing) ------------------
    const sources = [...new Set(prospects.map((p) => p.source ?? 'Unknown'))];
    const bySource = sources
      .map((src) => {
        const set = prospects.filter((p) => (p.source ?? 'Unknown') === src);
        return {
          source: src,
          found: set.length,
          qualified: set.filter((p) => reached.QUALIFIED.has(p.id)).length,
          won: set.filter((p) => p.status === 'CONVERTED').length,
          lost: set.filter((p) => p.status === 'DISQUALIFIED').length,
          value: sum(set.filter((p) => p.status === 'CONVERTED')),
        };
      })
      .sort((a, b) => b.found - a.found);

    // ---- By owner (team — manager / director) --------------------
    const byOwner = store.team
      .filter((t) => t.role === 'SALES')
      .map((t) => {
        const set = store.prospects.filter((p) => p.ownerEmployeeId === t.employeeId);
        const w = set.filter((p) => p.status === 'CONVERTED');
        const target = store.targets.find((x) => x.ownerEmployeeId === t.employeeId)?.target ?? 0;
        const wv = w.reduce((s, p) => s + (p.estimatedValue ?? 0), 0);
        return {
          employeeId: t.employeeId,
          owner: t.name,
          active: set.filter((p) => ACTIVE_STATUSES.includes(p.status) && p.status !== 'CONVERTED').length,
          qualified: set.filter((p) => p.status === 'QUALIFIED').length,
          won: w.length,
          wonValue: wv,
          pipelineValue: set
            .filter((p) => ACTIVE_STATUSES.includes(p.status) && p.status !== 'CONVERTED')
            .reduce((s, p) => s + (p.estimatedValue ?? 0), 0),
          activities: store.activities.filter(
            (a) => set.some((p) => p.id === a.prospectId) && inMonth(a.occurredAt),
          ).length,
          target,
          attainment: target > 0 ? Math.round((wv / target) * 100) : 0,
        };
      })
      .sort((a, b) => b.wonValue - a.wonValue);

    // ---- Loss reasons (why we lose — director) -------------------
    const lossReasons = (() => {
      const map = new Map<string, { count: number; value: number }>();
      for (const p of lost) {
        const r = p.lossReason ?? 'Not recorded';
        const e = map.get(r) ?? { count: 0, value: 0 };
        e.count += 1;
        e.value += p.estimatedValue ?? 0;
        map.set(r, e);
      }
      return [...map.entries()]
        .map(([reason, v]) => ({ reason, ...v }))
        .sort((a, b) => b.count - a.count);
    })();

    // ---- Trend: last 6 months -----------------------------------
    const trend = (() => {
      const months: { key: string; label: string; created: number; qualified: number; won: number; lost: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        months.push({ key: monthKey(d), label: d.toLocaleString(undefined, { month: 'short' }), created: 0, qualified: 0, won: 0, lost: 0 });
      }
      const idx = new Map(months.map((m) => [m.key, m]));
      for (const p of prospects) {
        const m = idx.get(monthKey(new Date(p.discoveredAt)));
        if (m) m.created += 1;
      }
      for (const h of statusHistory as { toStatus: ProspectStatus; changedAt: string }[]) {
        const m = idx.get(monthKey(new Date(h.changedAt)));
        if (!m) continue;
        if (h.toStatus === 'QUALIFIED') m.qualified += 1;
        if (h.toStatus === 'CONVERTED') m.won += 1;
        if (h.toStatus === 'DISQUALIFIED') m.lost += 1;
      }
      return months;
    })();

    // ---- Stage aging (bottlenecks — manager) -------------------
    const stageAging = FUNNEL_STAGES.filter((s) => s !== 'CONVERTED').map((s) => {
      const inStage = openPipeline.filter((p) => p.status === s);
      const ages = inStage.map((p) => {
        const last = (store.statusHistory as { prospectId: string; toStatus: ProspectStatus; changedAt: string }[])
          .filter((h) => h.prospectId === p.id && h.toStatus === s)
          .map((h) => new Date(h.changedAt).getTime())
          .sort((a, b) => b - a)[0];
        return last ? Math.floor((now - last) / DAY) : Math.floor((now - new Date(p.discoveredAt).getTime()) / DAY);
      });
      return {
        status: s,
        count: inStage.length,
        avgDays: ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0,
      };
    });

    // ---- Top open deals ---------------------------------------
    const topDeals = [...openPipeline]
      .sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0))
      .slice(0, 6);

    // ---- Activity sparkline (14d) ----------------------------
    const spark: number[] = [];
    for (let i = 13; i >= 0; i--) {
      const start = now - (i + 1) * DAY;
      const end = now - i * DAY;
      spark.push(A.filter((a) => {
        const t = new Date(a.occurredAt).getTime();
        return t >= start && t < end;
      }).length);
    }

    // ---- Needs attention ------------------------------------
    const attention = openPipeline
      .map((p) => {
        const pOverdue = (store.tasks as { prospectId: string; status: string; dueAt: string }[]).filter(
          (t) =>
            t.prospectId === p.id &&
            (t.status === 'OPEN' || t.status === 'IN_PROGRESS') &&
            new Date(t.dueAt).getTime() < now,
        ).length;
        const lastAct = store.activities
          .filter((a) => a.prospectId === p.id)
          .reduce<number>((m, a) => Math.max(m, new Date(a.occurredAt).getTime()), 0);
        const staleDays = lastAct ? Math.floor((now - lastAct) / DAY) : 999;
        let reason: string | null = null;
        if (pOverdue > 0) reason = `${pOverdue} overdue task${pOverdue > 1 ? 's' : ''}`;
        else if (staleDays >= 12) reason = `Stale · ${staleDays === 999 ? 'no activity' : `${staleDays}d quiet`}`;
        else if (p.temperature === 'HOT' && p.status !== 'QUALIFIED') reason = 'Hot but not qualified';
        return reason ? { prospect: p, reason, severity: pOverdue > 0 ? 2 : 1 } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 6);

    return {
      counts: {
        total: prospects.length,
        active: openPipeline.length,
        new: by('NEW').length,
        followUp: by('FOLLOW_UP').length,
        qualification: by('QUALIFICATION').length,
        qualified: by('QUALIFIED').length,
        won: won.length,
        lost: lost.length,
        dormant: dormant.length,
        openFollowUps,
        overdueTasks,
      },
      money: { pipelineValue, weightedPipeline, wonValue, lostValue, avgWonSize },
      winRate,
      conversionRate,
      funnel,
      valueByStage,
      temp,
      effort,
      activityMix,
      bySource,
      byOwner,
      lossReasons,
      trend,
      stageAging,
      topDeals,
      spark,
      attention,
    };
  }, [store, ownerEmployeeId]);
}

export type DashboardMetrics = ReturnType<typeof useDashboardMetrics>;

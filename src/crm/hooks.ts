/* =========================================================================
   Aegis CRM — API-shaped hooks over the mock store.

   Component code depends only on this module. Each hook/action maps 1:1 to a
   documented endpoint (blueprint §22) — noted in comments — so replacing the
   mock store with react-query + the real API is a contained change.
   ========================================================================= */

import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCrmStore } from './mockStore';
import { ACTIVE_STATUSES } from './constants';
import type { ProspectDetail, ProspectStatus, Temperature } from './types';

export interface ProspectFilter {
  search?: string;
  status?: ProspectStatus | 'ALL' | 'ACTIVE_SET';
  temperature?: Temperature | 'ALL';
}

/** GET /api/prospects */
export function useProspects(filter: ProspectFilter = {}) {
  const prospects = useCrmStore((s) => s.prospects);
  const tasks = useCrmStore((s) => s.tasks);
  const activities = useCrmStore((s) => s.activities);

  return useMemo(() => {
    const q = filter.search?.trim().toLowerCase();
    return prospects
      .filter((p) => {
        if (
          q &&
          !`${p.name} ${p.businessName ?? ''} ${p.projectLocation ?? ''} ${p.prospectNo}`
            .toLowerCase()
            .includes(q)
        )
          return false;
        if (filter.status === 'ACTIVE_SET' && !ACTIVE_STATUSES.includes(p.status)) return false;
        if (
          filter.status &&
          filter.status !== 'ALL' &&
          filter.status !== 'ACTIVE_SET' &&
          p.status !== filter.status
        )
          return false;
        if (filter.temperature && filter.temperature !== 'ALL' && p.temperature !== filter.temperature)
          return false;
        return true;
      })
      .map((p) => {
        const open = tasks
          .filter((t) => t.prospectId === p.id && (t.status === 'OPEN' || t.status === 'IN_PROGRESS'))
          .sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1));
        const lastActivity = activities
          .filter((a) => a.prospectId === p.id)
          .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))[0];
        return {
          ...p,
          nextTask: open[0],
          openTaskCount: open.length,
          overdueTaskCount: open.filter((t) => new Date(t.dueAt) < new Date()).length,
          lastActivityAt: lastActivity?.occurredAt,
        };
      });
  }, [prospects, tasks, activities, filter.search, filter.status, filter.temperature]);
}

export type ProspectListItem = ReturnType<typeof useProspects>[number];

/** GET /api/prospects/{id} */
export function useProspect(id: string | undefined) {
  return useCrmStore((s) => s.prospects.find((p) => p.id === id));
}

/** GET /api/prospects/{id} — assembled aggregate + GET /api/prospects/{id}/timeline */
export function useProspectDetail(id: string | undefined): ProspectDetail | undefined {
  const store = useCrmStore();
  return useMemo(() => {
    const prospect = store.prospects.find((p) => p.id === id);
    if (!prospect) return undefined;
    const byDate = <T extends { occurredAt?: string; startAt?: string; visitAt?: string; uploadedAt?: string; createdAt?: string; changedAt?: string }>(
      arr: T[],
      key: keyof T,
    ) => [...arr].sort((a, b) => (String(a[key]) < String(b[key]) ? 1 : -1));

    return {
      prospect,
      statusHistory: byDate(
        store.statusHistory.filter((h) => h.prospectId === id),
        'changedAt',
      ),
      contacts: store.prospectContacts.filter((c) => c.prospectId === id),
      activities: byDate(store.activities.filter((a) => a.prospectId === id), 'occurredAt'),
      tasks: [...store.tasks.filter((t) => t.prospectId === id)].sort((a, b) =>
        a.dueAt < b.dueAt ? -1 : 1,
      ),
      meetings: [...store.meetings.filter((m) => m.prospectId === id)].sort((a, b) =>
        a.startAt < b.startAt ? -1 : 1,
      ),
      siteVisits: byDate(store.siteVisits.filter((v) => v.prospectId === id), 'visitAt'),
      requirementResponses: byDate(
        store.requirementResponses.filter((r) => r.prospectId === id),
        'createdAt',
      ),
      documents: byDate(store.documents.filter((d) => d.prospectId === id), 'uploadedAt'),
      timeline: byDate(store.timeline.filter((t) => t.prospectId === id), 'occurredAt'),
    };
  }, [store, id]);
}

/** GET /api/my/tasks — Daily Planner / Pending Follow-ups (blueprint §10) */
export function useMyTasks() {
  const tasks = useCrmStore((s) => s.tasks);
  return useMemo(
    () => [...tasks].sort((a, b) => (a.dueAt < b.dueAt ? -1 : 1)),
    [tasks],
  );
}

/** GET /api/my/meetings */
export function useMyMeetings() {
  const meetings = useCrmStore((s) => s.meetings);
  return useMemo(() => [...meetings].sort((a, b) => (a.startAt < b.startAt ? -1 : 1)), [meetings]);
}

export function useRequirementTemplates() {
  return useCrmStore((s) => s.requirementTemplates);
}

/** All the write commands (blueprint §19.1 / §22). */
export function useCrmActions() {
  return useCrmStore(
    useShallow((s) => ({
      createProspect: s.createProspect,
      updateProspect: s.updateProspect,
      changeStatus: s.changeStatus,
      changeTemperature: s.changeTemperature,
      addContact: s.addContact,
      logActivity: s.logActivity,
      createTask: s.createTask,
      updateTask: s.updateTask,
      completeTask: s.completeTask,
      scheduleMeeting: s.scheduleMeeting,
      saveSiteVisit: s.saveSiteVisit,
      submitRequirementResponse: s.submitRequirementResponse,
      uploadDocument: s.uploadDocument,
      convertProspect: s.convertProspect,
      resetDemoData: s.resetDemoData,
    })),
  );
}

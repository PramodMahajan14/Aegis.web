/* =========================================================================
   Aegis CRM — in-memory "backend" for Layer 1.

   No API exists for CRM entities yet. This zustand store stands in for the
   documented endpoints (blueprint §22): it holds every Layer 1 record,
   applies the same invariants (status transitions append StatusHistory,
   every mutation appends a TimelineEvent — blueprint §14), and persists to
   localStorage so work survives a reload. `src/crm/hooks.ts` wraps it with
   an API-shaped surface so swapping in the real ASP.NET endpoints is
   mechanical.
   ========================================================================= */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Activity,
  ActivityOutcome,
  ActivityType,
  Contact,
  CrmDocument,
  DocumentRelation,
  Id,
  Meeting,
  MeetingParticipant,
  Prospect,
  ProspectContact,
  ProspectStatus,
  ProspectStatusHistory,
  RequirementResponse,
  RequirementTemplate,
  SiteVisit,
  SiteVisitPhoto,
  Task,
  TaskPriority,
  TimelineEvent,
  TimelineEventType,
  Temperature,
  TeamMember,
  SalesTarget,
} from './types';
import { seedTemplate, buildSeed } from './seed';
import { CURRENT_ORG_ID, CURRENT_USER, uid, nowIso } from './env';

export { CURRENT_ORG_ID, CURRENT_USER, uid, nowIso };

interface CrmState {
  prospects: Prospect[];
  statusHistory: ProspectStatusHistory[];
  contacts: Contact[];
  prospectContacts: ProspectContact[];
  activities: Activity[];
  tasks: Task[];
  meetings: Meeting[];
  siteVisits: SiteVisit[];
  requirementTemplates: RequirementTemplate[];
  requirementResponses: RequirementResponse[];
  documents: CrmDocument[];
  timeline: TimelineEvent[];
  team: TeamMember[];
  targets: SalesTarget[];

  // mutations
  createProspect: (input: CreateProspectInput) => Prospect;
  updateProspect: (id: Id, patch: Partial<Prospect>) => void;
  changeStatus: (id: Id, toStatus: ProspectStatus, reason?: string, lossReason?: string) => void;
  changeTemperature: (id: Id, temperature: Temperature) => void;
  addContact: (prospectId: Id, input: AddContactInput) => void;
  logActivity: (prospectId: Id, input: LogActivityInput) => Activity;
  createTask: (prospectId: Id, input: CreateTaskInput) => Task;
  updateTask: (id: Id, patch: Partial<Task>) => void;
  completeTask: (id: Id) => void;
  scheduleMeeting: (prospectId: Id, input: ScheduleMeetingInput) => void;
  saveSiteVisit: (prospectId: Id, input: SaveSiteVisitInput) => void;
  submitRequirementResponse: (
    prospectId: Id,
    templateId: Id,
    answers: RequirementResponse['answers'],
    context?: string,
  ) => RequirementResponse;
  uploadDocument: (prospectId: Id, input: UploadDocumentInput) => void;
  convertProspect: (id: Id, input: ConvertInput) => void;
  resetDemoData: () => void;
}

export interface CreateProspectInput {
  name: string;
  businessName?: string;
  description?: string;
  projectLocation?: string;
  officeLocation?: string;
  source?: string;
  temperature?: Temperature;
  estimatedValue?: number;
  expectedDecisionDate?: string;
  projectProgress?: string;
}
export interface AddContactInput {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  jobTitle?: string;
  role: string;
  isPrimary: boolean;
  notes?: string;
}
export interface LogActivityInput {
  type: ActivityType;
  outcome: ActivityOutcome;
  subject?: string;
  notes?: string;
  occurredAt: string;
  contactId?: Id;
  followUp?: { title: string; dueAt: string; priority: TaskPriority } | null;
}
export interface CreateTaskInput {
  title: string;
  description?: string;
  dueAt: string;
  priority: TaskPriority;
  type?: 'FOLLOW_UP' | 'GENERAL';
  createdFromActivityId?: Id;
}
export interface ScheduleMeetingInput {
  title: string;
  startAt: string;
  endAt?: string;
  location?: string;
  agenda?: string;
  participants: MeetingParticipant[];
}
export interface SaveSiteVisitInput {
  visitAt: string;
  location?: string;
  purpose?: string;
  peopleMet: string[];
  summary?: string;
  notes?: string;
  photos: SiteVisitPhoto[];
  completed: boolean;
  nextTask?: { title: string; dueAt: string; priority: TaskPriority } | null;
}
export interface UploadDocumentInput {
  fileName: string;
  mimeType?: string;
  size?: number;
  relation: DocumentRelation;
  note?: string;
  previousVersionId?: Id;
}
export interface ConvertInput {
  opportunityName: string;
  amount?: number;
  expectedCloseDate?: string;
}

function makeTimeline(
  prospectId: Id,
  eventType: TimelineEventType,
  title: string,
  summary?: string,
): TimelineEvent {
  return {
    id: uid(),
    organizationId: CURRENT_ORG_ID,
    prospectId,
    eventType,
    actorName: CURRENT_USER.name,
    occurredAt: nowIso(),
    title,
    summary,
  };
}

const seed = buildSeed();

export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      ...seed,
      requirementTemplates: [seedTemplate],

      createProspect: (input) => {
        const count = get().prospects.length + 1;
        const prospect: Prospect = {
          id: uid(),
          organizationId: CURRENT_ORG_ID,
          prospectNo: `PRS-${String(count).padStart(4, '0')}`,
          name: input.name,
          businessName: input.businessName,
          description: input.description,
          projectLocation: input.projectLocation,
          officeLocation: input.officeLocation,
          ownerEmployeeId: CURRENT_USER.employeeId,
          ownerName: CURRENT_USER.name,
          status: 'NEW',
          source: input.source,
          temperature: input.temperature,
          projectProgress: input.projectProgress,
          estimatedValue: input.estimatedValue,
          discoveredAt: nowIso(),
          expectedDecisionDate: input.expectedDecisionDate,
          createdAt: nowIso(),
        };
        set((s) => ({
          prospects: [prospect, ...s.prospects],
          statusHistory: [
            {
              id: uid(),
              prospectId: prospect.id,
              fromStatus: null,
              toStatus: 'NEW',
              changedByName: CURRENT_USER.name,
              changedAt: nowIso(),
            },
            ...s.statusHistory,
          ],
          timeline: [
            makeTimeline(
              prospect.id,
              'ProspectCreated',
              `Prospect ${prospect.name} created`,
              `${prospect.prospectNo} · owner ${prospect.ownerName}`,
            ),
            ...s.timeline,
          ],
        }));
        return prospect;
      },

      updateProspect: (id, patch) =>
        set((s) => ({
          prospects: s.prospects.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p,
          ),
          timeline: [
            makeTimeline(id, 'ProspectUpdated', 'Prospect details updated'),
            ...s.timeline,
          ],
        })),

      changeStatus: (id, toStatus, reason, lossReason) =>
        set((s) => {
          const p = s.prospects.find((x) => x.id === id);
          if (!p || p.status === toStatus) return s;
          const terminal = toStatus === 'DISQUALIFIED' || toStatus === 'CONVERTED';
          return {
            prospects: s.prospects.map((x) =>
              x.id === id
                ? {
                    ...x,
                    status: toStatus,
                    updatedAt: nowIso(),
                    lossReason: toStatus === 'DISQUALIFIED' ? lossReason ?? x.lossReason : x.lossReason,
                    closedAt: terminal ? nowIso() : x.closedAt,
                  }
                : x,
            ),
            statusHistory: [
              {
                id: uid(),
                prospectId: id,
                fromStatus: p.status,
                toStatus,
                changedByName: CURRENT_USER.name,
                reason: lossReason ? `${lossReason}${reason ? ` — ${reason}` : ''}` : reason,
                changedAt: nowIso(),
              },
              ...s.statusHistory,
            ],
            timeline: [
              makeTimeline(
                id,
                'ProspectStatusChanged',
                `${p.status} → ${toStatus}`,
                reason,
              ),
              ...s.timeline,
            ],
          };
        }),

      changeTemperature: (id, temperature) =>
        set((s) => ({
          prospects: s.prospects.map((p) =>
            p.id === id ? { ...p, temperature, updatedAt: nowIso() } : p,
          ),
          timeline: [
            makeTimeline(id, 'TemperatureChanged', `Temperature set to ${temperature}`),
            ...s.timeline,
          ],
        })),

      addContact: (prospectId, input) =>
        set((s) => {
          const contact: Contact = {
            id: uid(),
            organizationId: CURRENT_ORG_ID,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            email: input.email,
            jobTitle: input.jobTitle,
          };
          const link: ProspectContact = {
            id: uid(),
            prospectId,
            contactId: contact.id,
            contact,
            role: input.role,
            isPrimary: input.isPrimary,
            notes: input.notes,
          };
          return {
            contacts: [contact, ...s.contacts],
            prospectContacts: input.isPrimary
              ? [
                  link,
                  ...s.prospectContacts.map((pc) =>
                    pc.prospectId === prospectId ? { ...pc, isPrimary: false } : pc,
                  ),
                ]
              : [link, ...s.prospectContacts],
            timeline: [
              makeTimeline(
                prospectId,
                'ContactLinked',
                `${contact.firstName} ${contact.lastName} added as ${input.role}`,
              ),
              ...s.timeline,
            ],
          };
        }),

      logActivity: (prospectId, input) => {
        const prospect = get().prospects.find((p) => p.id === prospectId);
        const activity: Activity = {
          id: uid(),
          organizationId: CURRENT_ORG_ID,
          prospectId,
          type: input.type,
          outcome: input.outcome,
          subject: input.subject,
          notes: input.notes,
          contactId: input.contactId,
          occurredAt: input.occurredAt,
          createdByName: CURRENT_USER.name,
        };
        set((s) => {
          const extra: Partial<CrmState> = {};
          const tasks = [...s.tasks];
          const timeline = [
            makeTimeline(
              prospectId,
              'ActivityLogged',
              `${input.type} — ${input.outcome.replace(/_/g, ' ').toLowerCase()}`,
              input.subject || input.notes,
            ),
            ...s.timeline,
          ];
          if (input.followUp) {
            const task: Task = {
              id: uid(),
              organizationId: CURRENT_ORG_ID,
              prospectId,
              prospectName: prospect?.name ?? '',
              title: input.followUp.title,
              type: 'FOLLOW_UP',
              assignedToName: CURRENT_USER.name,
              dueAt: input.followUp.dueAt,
              priority: input.followUp.priority,
              status: 'OPEN',
              createdFromActivityId: activity.id,
              createdAt: nowIso(),
            };
            tasks.unshift(task);
            timeline.unshift(
              makeTimeline(prospectId, 'TaskCreated', `Follow-up: ${task.title}`),
            );
          }
          void extra;
          return { activities: [activity, ...s.activities], tasks, timeline };
        });
        return activity;
      },

      createTask: (prospectId, input) => {
        const prospect = get().prospects.find((p) => p.id === prospectId);
        const task: Task = {
          id: uid(),
          organizationId: CURRENT_ORG_ID,
          prospectId,
          prospectName: prospect?.name ?? '',
          title: input.title,
          description: input.description,
          type: input.type ?? 'GENERAL',
          assignedToName: CURRENT_USER.name,
          dueAt: input.dueAt,
          priority: input.priority,
          status: 'OPEN',
          createdFromActivityId: input.createdFromActivityId,
          createdAt: nowIso(),
        };
        set((s) => ({
          tasks: [task, ...s.tasks],
          timeline: [
            makeTimeline(prospectId, 'TaskCreated', `Task: ${task.title}`),
            ...s.timeline,
          ],
        }));
        return task;
      },

      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

      completeTask: (id) =>
        set((s) => {
          const t = s.tasks.find((x) => x.id === id);
          if (!t) return s;
          return {
            tasks: s.tasks.map((x) =>
              x.id === id
                ? { ...x, status: 'COMPLETED', completedAt: nowIso() }
                : x,
            ),
            timeline: [
              makeTimeline(t.prospectId, 'TaskCompleted', `Completed: ${t.title}`),
              ...s.timeline,
            ],
          };
        }),

      scheduleMeeting: (prospectId, input) =>
        set((s) => {
          const prospect = s.prospects.find((p) => p.id === prospectId);
          const meeting: Meeting = {
            id: uid(),
            organizationId: CURRENT_ORG_ID,
            prospectId,
            prospectName: prospect?.name ?? '',
            title: input.title,
            startAt: input.startAt,
            endAt: input.endAt,
            location: input.location,
            agenda: input.agenda,
            participants: input.participants,
            createdAt: nowIso(),
          };
          return {
            meetings: [meeting, ...s.meetings],
            timeline: [
              makeTimeline(
                prospectId,
                'MeetingScheduled',
                `Meeting: ${meeting.title}`,
                new Date(meeting.startAt).toLocaleString(),
              ),
              ...s.timeline,
            ],
          };
        }),

      saveSiteVisit: (prospectId, input) =>
        set((s) => {
          const prospect = s.prospects.find((p) => p.id === prospectId);
          const tasks = [...s.tasks];
          const timeline = [...s.timeline];
          let nextTaskId: Id | undefined;
          if (input.nextTask) {
            const task: Task = {
              id: uid(),
              organizationId: CURRENT_ORG_ID,
              prospectId,
              prospectName: prospect?.name ?? '',
              title: input.nextTask.title,
              type: 'FOLLOW_UP',
              assignedToName: CURRENT_USER.name,
              dueAt: input.nextTask.dueAt,
              priority: input.nextTask.priority,
              status: 'OPEN',
              createdAt: nowIso(),
            };
            nextTaskId = task.id;
            tasks.unshift(task);
            timeline.unshift(makeTimeline(prospectId, 'TaskCreated', `Follow-up: ${task.title}`));
          }
          const visit: SiteVisit = {
            id: uid(),
            organizationId: CURRENT_ORG_ID,
            prospectId,
            prospectName: prospect?.name ?? '',
            visitAt: input.visitAt,
            location: input.location,
            purpose: input.purpose,
            peopleMet: input.peopleMet,
            summary: input.summary,
            notes: input.notes,
            photos: input.photos,
            nextTaskId,
            completed: input.completed,
            createdAt: nowIso(),
          };
          if (input.completed) {
            timeline.unshift(
              makeTimeline(
                prospectId,
                'SiteVisitCompleted',
                `Site visit completed`,
                `${input.photos.length} photo(s) · met ${input.peopleMet.length} people`,
              ),
            );
          }
          return { siteVisits: [visit, ...s.siteVisits], tasks, timeline };
        }),

      submitRequirementResponse: (prospectId, templateId, answers, context) => {
        const template = get().requirementTemplates.find((t) => t.id === templateId)!;
        const response: RequirementResponse = {
          id: uid(),
          organizationId: CURRENT_ORG_ID,
          templateId,
          templateName: template.name,
          templateVersion: template.version,
          prospectId,
          context,
          status: 'SUBMITTED',
          answers,
          submittedAt: nowIso(),
          createdAt: nowIso(),
        };
        set((s) => ({
          requirementResponses: [response, ...s.requirementResponses],
          timeline: [
            makeTimeline(
              prospectId,
              'RequirementSubmitted',
              `${template.name} captured`,
              context,
            ),
            ...s.timeline,
          ],
        }));
        return response;
      },

      uploadDocument: (prospectId, input) =>
        set((s) => {
          const prev = input.previousVersionId
            ? s.documents.find((d) => d.id === input.previousVersionId)
            : undefined;
          const doc: CrmDocument = {
            id: uid(),
            organizationId: CURRENT_ORG_ID,
            prospectId,
            fileName: input.fileName,
            mimeType: input.mimeType,
            size: input.size,
            relation: input.relation,
            versionNo: prev ? prev.versionNo + 1 : 1,
            previousVersionId: input.previousVersionId,
            note: input.note,
            uploadedByName: CURRENT_USER.name,
            uploadedAt: nowIso(),
          };
          return {
            documents: [doc, ...s.documents],
            timeline: [
              makeTimeline(
                prospectId,
                'DocumentUploaded',
                `${input.relation} — ${input.fileName}${doc.versionNo > 1 ? ` (v${doc.versionNo})` : ''}`,
              ),
              ...s.timeline,
            ],
          };
        }),

      convertProspect: (id, input) =>
        set((s) => {
          const opportunityId = uid();
          return {
            prospects: s.prospects.map((p) =>
              p.id === id
                ? { ...p, status: 'CONVERTED', convertedOpportunityId: opportunityId, updatedAt: nowIso() }
                : p,
            ),
            statusHistory: [
              {
                id: uid(),
                prospectId: id,
                fromStatus: s.prospects.find((p) => p.id === id)?.status ?? null,
                toStatus: 'CONVERTED',
                changedByName: CURRENT_USER.name,
                reason: `Converted to opportunity "${input.opportunityName}"`,
                changedAt: nowIso(),
              },
              ...s.statusHistory,
            ],
            timeline: [
              makeTimeline(
                id,
                'ProspectConverted',
                `Converted to Opportunity`,
                input.opportunityName,
              ),
              ...s.timeline,
            ],
          };
        }),

      resetDemoData: () => set(() => ({ ...buildSeed(), requirementTemplates: [seedTemplate] })),
    }),
    {
      name: 'aegis-crm-layer1',
      version: 3,
      // Older snapshots predate team/targets — start fresh rather than migrate.
      migrate: (persisted, from) => (from < 3 ? undefined : (persisted as never)),
    },
  ),
);

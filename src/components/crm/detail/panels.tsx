import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { EmptyState } from '../EmptyState';
import { TimelineFeed } from '../TimelineFeed';
import { PersonAvatar } from '../PersonAvatar';
import {
  ActivityItem,
  ContactRow,
  DocumentRow,
  MeetingItem,
  TaskRow,
} from '../items';
import { useCrmActions } from '../../../crm/hooks';
import type { useComposers } from '../useComposers';
import type { ProspectDetail } from '../../../crm/types';
import { formatDate, formatDateTime, formatMoney, relativeTime } from '../../../crm/format';
import { STATUS_LABEL } from '../../../crm/constants';

type Composers = ReturnType<typeof useComposers>;
interface PanelProps {
  detail: ProspectDetail;
  composers: Composers;
}

function PanelCard({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-[0.9375rem] font-semibold">
          {title}
          {count != null && count > 0 && <Badge variant="neutral">{count}</Badge>}
        </h3>
        {action}
      </div>
      <div className="px-5">{children}</div>
    </Card>
  );
}

function contactName(detail: ProspectDetail, contactId?: string) {
  if (!contactId) return undefined;
  const c = detail.contacts.find((x) => x.contactId === contactId)?.contact;
  return c ? `${c.firstName} ${c.lastName}` : undefined;
}

/* ------------------------------------------------------------- Overview */

export function OverviewPanel({ detail, composers }: PanelProps) {
  const { prospect } = detail;
  const openTasks = detail.tasks.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
  const nextMeeting = detail.meetings.find((m) => new Date(m.startAt) > new Date());
  const { completeTask } = useCrmActions();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <PanelCard
          title="Recent activity"
          action={
            <Button size="sm" variant="outline" onClick={() => composers.logActivity(prospect.id)}>
              <i className="bi bi-plus-lg" /> Log
            </Button>
          }
        >
          {detail.activities.length === 0 ? (
            <EmptyState icon="bi-chat-dots" title="No activity logged" compact />
          ) : (
            <div className="divide-y divide-border">
              {detail.activities.slice(0, 4).map((a) => (
                <ActivityItem
                  key={a.id}
                  activity={a}
                  contactName={contactName(detail, a.contactId)}
                />
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title="Open tasks"
          count={openTasks.length}
          action={
            <Button size="sm" variant="outline" onClick={() => composers.addTask(prospect.id)}>
              <i className="bi bi-plus-lg" /> Task
            </Button>
          }
        >
          {openTasks.length === 0 ? (
            <EmptyState icon="bi-check2-all" title="Nothing pending" compact />
          ) : (
            <div className="divide-y divide-border">
              {openTasks.map((t) => (
                <TaskRow key={t.id} task={t} onComplete={completeTask} />
              ))}
            </div>
          )}
        </PanelCard>
      </div>

      <div className="space-y-4">
        <PanelCard title="Key facts">
          <dl className="divide-y divide-border text-[0.8125rem]">
            {[
              ['Owner', prospect.ownerName],
              ['Source', prospect.source ?? '—'],
              ['Construction stage', prospect.projectProgress ?? '—'],
              ['Est. value', formatMoney(prospect.estimatedValue)],
              ['Expected decision', formatDate(prospect.expectedDecisionDate)],
              ['Discovered', formatDate(prospect.discoveredAt)],
              ['Office location', prospect.officeLocation ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </PanelCard>

        {nextMeeting && (
          <PanelCard title="Next meeting">
            <MeetingItem meeting={nextMeeting} />
          </PanelCard>
        )}

        <PanelCard title="Status history">
          {detail.statusHistory.length === 0 ? (
            <EmptyState icon="bi-clock-history" title="No changes" compact />
          ) : (
            <ol className="divide-y divide-border text-[0.8125rem]">
              {detail.statusHistory.slice(0, 6).map((h) => (
                <li key={h.id} className="py-2">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    {h.fromStatus ? `${STATUS_LABEL[h.fromStatus]} → ` : ''}
                    {STATUS_LABEL[h.toStatus]}
                  </div>
                  {h.reason && <p className="text-muted-foreground">{h.reason}</p>}
                  <p className="text-xs text-muted-foreground">
                    {h.changedByName} · {relativeTime(h.changedAt)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </PanelCard>

        <button
          type="button"
          onClick={() => navigate(`/prospects/${prospect.id}?tab=timeline`)}
          className="w-full rounded-lg border border-border bg-card py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          View full timeline
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Contacts */

export function ContactsPanel({ detail, composers }: PanelProps) {
  return (
    <PanelCard
      title="Contacts"
      count={detail.contacts.length}
      action={
        <Button size="sm" variant="outline" onClick={() => composers.addContact(detail.prospect.id)}>
          <i className="bi bi-person-plus" /> Add
        </Button>
      }
    >
      {detail.contacts.length === 0 ? (
        <EmptyState
          icon="bi-people"
          title="No contacts linked"
          description="Add the people involved — decision maker, purchase, site engineer."
          compact
        />
      ) : (
        <div className="divide-y divide-border">
          {detail.contacts.map((pc) => (
            <ContactRow
              key={pc.id}
              pc={pc}
              onLogActivity={() => composers.logActivity(detail.prospect.id)}
            />
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Activities */

export function ActivitiesPanel({ detail, composers }: PanelProps) {
  return (
    <PanelCard
      title="Activities"
      count={detail.activities.length}
      action={
        <Button size="sm" onClick={() => composers.logActivity(detail.prospect.id)}>
          <i className="bi bi-plus-lg" /> Log activity
        </Button>
      }
    >
      {detail.activities.length === 0 ? (
        <EmptyState icon="bi-chat-dots" title="No activity yet" description="Log calls, emails and notes as work happens." compact />
      ) : (
        <div className="divide-y divide-border">
          {detail.activities.map((a) => (
            <ActivityItem key={a.id} activity={a} contactName={contactName(detail, a.contactId)} />
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Tasks */

export function TasksPanel({ detail, composers }: PanelProps) {
  const { completeTask } = useCrmActions();
  const open = detail.tasks.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
  const done = detail.tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'CANCELLED');
  return (
    <PanelCard
      title="Tasks"
      count={open.length}
      action={
        <Button size="sm" onClick={() => composers.addTask(detail.prospect.id)}>
          <i className="bi bi-plus-lg" /> Add task
        </Button>
      }
    >
      {detail.tasks.length === 0 ? (
        <EmptyState icon="bi-check2-square" title="No tasks" compact />
      ) : (
        <div className="divide-y divide-border">
          {open.map((t) => (
            <TaskRow key={t.id} task={t} onComplete={completeTask} />
          ))}
          {done.length > 0 && (
            <details className="py-2">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                {done.length} completed
              </summary>
              <div className="mt-1 divide-y divide-border">
                {done.map((t) => (
                  <TaskRow key={t.id} task={t} onComplete={completeTask} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Meetings */

export function MeetingsPanel({ detail, composers }: PanelProps) {
  return (
    <PanelCard
      title="Meetings"
      count={detail.meetings.length}
      action={
        <Button size="sm" onClick={() => composers.scheduleMeeting(detail.prospect.id)}>
          <i className="bi bi-plus-lg" /> Schedule
        </Button>
      }
    >
      {detail.meetings.length === 0 ? (
        <EmptyState icon="bi-calendar-event" title="No meetings" compact />
      ) : (
        <div className="divide-y divide-border">
          {detail.meetings.map((m) => (
            <MeetingItem key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Site visits */

export function SiteVisitsPanel({ detail, composers }: PanelProps) {
  return (
    <PanelCard
      title="Site visits"
      count={detail.siteVisits.length}
      action={
        <Button size="sm" onClick={() => composers.startSiteVisit(detail.prospect.id)}>
          <i className="bi bi-geo-alt" /> Start visit
        </Button>
      }
    >
      {detail.siteVisits.length === 0 ? (
        <EmptyState
          icon="bi-geo-alt"
          title="No site visits"
          description="Record a visit — people met, notes, photos and a requirement survey."
          compact
        />
      ) : (
        <div className="divide-y divide-border">
          {detail.siteVisits.map((v) => (
            <div key={v.id} className="py-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <i className="bi bi-geo-alt" />
                </span>
                <div>
                  <p className="text-[0.8125rem] font-medium text-foreground">
                    {v.purpose || 'Site visit'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(v.visitAt)}
                    {v.location ? ` · ${v.location}` : ''} ·{' '}
                    {v.completed ? 'Completed' : 'In progress'}
                  </p>
                </div>
              </div>
              {v.summary && <p className="mt-1.5 pl-10 text-[0.8125rem] text-muted-foreground">{v.summary}</p>}
              {v.peopleMet.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 pl-10">
                  {v.peopleMet.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground"
                    >
                      <PersonAvatar name={p} size="xs" />
                      {p}
                    </span>
                  ))}
                </div>
              )}
              {v.photos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-10">
                  {v.photos.map((ph) => (
                    <img
                      key={ph.id}
                      src={ph.dataUrl}
                      alt={ph.name}
                      className="size-14 rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              )}
              <div className="mt-2 flex gap-2 pl-10">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => composers.captureRequirement(detail.prospect.id, 'Site Visit')}
                >
                  <i className="bi bi-clipboard-plus" /> Capture requirement
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Requirements */

export function RequirementsPanel({ detail, composers }: PanelProps) {
  return (
    <PanelCard
      title="Requirements"
      count={detail.requirementResponses.length}
      action={
        <Button size="sm" onClick={() => composers.captureRequirement(detail.prospect.id)}>
          <i className="bi bi-plus-lg" /> Capture
        </Button>
      }
    >
      {detail.requirementResponses.length === 0 ? (
        <EmptyState
          icon="bi-clipboard-data"
          title="No requirements captured"
          description="Run a template-driven survey to structure project, commercial and decision info."
          compact
        />
      ) : (
        <div className="divide-y divide-border">
          {detail.requirementResponses.map((r) => (
            <div key={r.id} className="py-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand-stronger">
                  <i className="bi bi-clipboard-check" />
                </span>
                <div>
                  <p className="text-[0.8125rem] font-medium text-foreground">
                    {r.templateName} <span className="text-muted-foreground">v{r.templateVersion}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.context ? `${r.context} · ` : ''}
                    {r.status === 'SUBMITTED' ? 'Submitted' : 'Draft'} ·{' '}
                    {relativeTime(r.submittedAt ?? r.createdAt)}
                  </p>
                </div>
              </div>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 pl-10 sm:grid-cols-2">
                {Object.entries(r.answers)
                  .filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && v.length === 0))
                  .map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <dt className="text-muted-foreground">{k.replace(/^q-/, '').replace(/-/g, ' ')}</dt>
                      <dd className="font-medium text-foreground">
                        {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : Array.isArray(v) ? v.join(', ') : String(v)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Documents */

export function DocumentsPanel({ detail, composers }: PanelProps) {
  return (
    <PanelCard
      title="Documents & BOQ"
      count={detail.documents.length}
      action={
        <Button size="sm" onClick={() => composers.uploadDocument(detail.prospect.id)}>
          <i className="bi bi-upload" /> Upload
        </Button>
      }
    >
      {detail.documents.length === 0 ? (
        <EmptyState icon="bi-folder" title="No documents" description="Upload BOQ, plans, drawings and quotes." compact />
      ) : (
        <div className="divide-y divide-border">
          {detail.documents.map((d) => (
            <DocumentRow
              key={d.id}
              doc={d}
              onNewVersion={(id) => composers.uploadDocument(detail.prospect.id, id)}
            />
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ------------------------------------------------------------- Timeline */

export function TimelinePanel({ detail }: PanelProps) {
  return (
    <PanelCard title="Timeline" count={detail.timeline.length}>
      <div className="py-4">
        <TimelineFeed events={detail.timeline} />
      </div>
    </PanelCard>
  );
}

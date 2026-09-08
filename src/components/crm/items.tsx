import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Switch';
import { PersonAvatar } from './PersonAvatar';
import {
  ACTIVITY_OUTCOME_LABEL,
  ACTIVITY_TYPE_META,
  DOCUMENT_RELATION_META,
  TASK_PRIORITY_META,
  TASK_STATUS_VARIANT,
  TASK_STATUS_LABEL,
} from '../../crm/constants';
import { formatBytes, formatDate, formatDateTime, isOverdue, isToday, relativeTime } from '../../crm/format';
import type { Activity, CrmDocument, Meeting, ProspectContact, Task } from '../../crm/types';

export function ActivityItem({ activity, contactName }: { activity: Activity; contactName?: string }) {
  const meta = ACTIVITY_TYPE_META[activity.type];
  return (
    <div className="flex gap-3 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-[0.8rem] text-muted-foreground">
        <i className={`bi ${meta.icon}`} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[0.8125rem] font-medium text-foreground">
            {activity.subject || meta.label}
          </span>
          <Badge variant="outline">{ACTIVITY_OUTCOME_LABEL[activity.outcome]}</Badge>
        </div>
        {activity.notes && (
          <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{activity.notes}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {meta.label}
          {contactName ? ` · ${contactName}` : ''} · {activity.createdByName} ·{' '}
          <span title={formatDateTime(activity.occurredAt)}>{relativeTime(activity.occurredAt)}</span>
        </p>
      </div>
    </div>
  );
}

export function TaskRow({
  task,
  onComplete,
  showProspect,
  onOpenProspect,
}: {
  task: Task;
  onComplete: (id: string) => void;
  showProspect?: boolean;
  onOpenProspect?: (id: string) => void;
}) {
  const done = task.status === 'COMPLETED' || task.status === 'CANCELLED';
  const overdue = !done && isOverdue(task.dueAt);
  const today = !done && isToday(task.dueAt);
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Checkbox
        className="mt-0.5"
        checked={done}
        disabled={done}
        onChange={() => onComplete(task.id)}
        aria-label={`Complete ${task.title}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'text-[0.8125rem] font-medium',
              done ? 'text-muted-foreground line-through' : 'text-foreground',
            )}
          >
            {task.title}
          </span>
          {task.type === 'FOLLOW_UP' && !done && <Badge variant="outline">Follow-up</Badge>}
          {done && <Badge variant={TASK_STATUS_VARIANT[task.status]}>{TASK_STATUS_LABEL[task.status]}</Badge>}
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <span
            className={cn(
              overdue && 'font-medium text-danger',
              today && 'font-medium text-warning',
            )}
          >
            <i className="bi bi-calendar3 mr-1" />
            {overdue ? 'Overdue · ' : today ? 'Today · ' : ''}
            {formatDate(task.dueAt)}
          </span>
          <Badge variant={TASK_PRIORITY_META[task.priority].variant}>
            {TASK_PRIORITY_META[task.priority].label}
          </Badge>
          {showProspect && (
            <button
              type="button"
              className="text-brand-strong hover:underline"
              onClick={() => onOpenProspect?.(task.prospectId)}
            >
              {task.prospectName}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export function MeetingItem({ meeting }: { meeting: Meeting }) {
  const upcoming = new Date(meeting.startAt) > new Date();
  return (
    <div className="flex gap-3 py-3">
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-lg text-center text-[0.8rem] leading-none',
          upcoming ? 'bg-brand-soft text-brand-stronger' : 'bg-accent text-muted-foreground',
        )}
      >
        <span className="flex flex-col">
          <span className="text-[0.6rem] uppercase">
            {new Date(meeting.startAt).toLocaleString(undefined, { month: 'short' })}
          </span>
          <span className="text-sm font-semibold">{new Date(meeting.startAt).getDate()}</span>
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.8125rem] font-medium text-foreground">{meeting.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDateTime(meeting.startAt)}
          {meeting.location ? ` · ${meeting.location}` : ''}
        </p>
        {meeting.participants.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {meeting.participants.map((p) => (
              <span
                key={p.name}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground"
              >
                <PersonAvatar name={p.name} size="xs" />
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ContactRow({
  pc,
  onLogActivity,
}: {
  pc: ProspectContact;
  onLogActivity?: () => void;
}) {
  const { contact } = pc;
  return (
    <div className="flex items-center gap-3 py-3">
      <PersonAvatar name={`${contact.firstName} ${contact.lastName}`} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[0.8125rem] font-medium text-foreground">
            {contact.firstName} {contact.lastName}
          </span>
          {pc.isPrimary && <Badge variant="brand">Primary</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          {pc.role}
          {contact.jobTitle ? ` · ${contact.jobTitle}` : ''}
        </p>
        {(contact.phone || contact.email) && (
          <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="hover:text-foreground">
                <i className="bi bi-telephone mr-1" />
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                <i className="bi bi-envelope mr-1" />
                {contact.email}
              </a>
            )}
          </p>
        )}
        {pc.notes && <p className="mt-0.5 text-xs text-muted-foreground">{pc.notes}</p>}
      </div>
      {onLogActivity && (
        <button
          type="button"
          onClick={onLogActivity}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-brand-strong hover:bg-accent"
        >
          Log call
        </button>
      )}
    </div>
  );
}

export function DocumentRow({
  doc,
  onNewVersion,
}: {
  doc: CrmDocument;
  onNewVersion?: (id: string) => void;
}) {
  const meta = DOCUMENT_RELATION_META[doc.relation];
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-[0.95rem] text-muted-foreground">
        <i className={`bi ${meta.icon}`} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[0.8125rem] font-medium text-foreground">{doc.fileName}</span>
          {doc.versionNo > 1 && <Badge variant="outline">v{doc.versionNo}</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          {meta.label}
          {doc.size ? ` · ${formatBytes(doc.size)}` : ''} · {doc.uploadedByName} ·{' '}
          {relativeTime(doc.uploadedAt)}
        </p>
        {doc.note && <p className="mt-0.5 text-xs text-muted-foreground">{doc.note}</p>}
      </div>
      {onNewVersion && (
        <button
          type="button"
          onClick={() => onNewVersion(doc.id)}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-brand-strong hover:bg-accent"
        >
          New version
        </button>
      )}
    </div>
  );
}

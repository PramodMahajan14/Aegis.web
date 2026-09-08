import { cn } from '../../lib/cn';
import { formatDateTime, relativeTime } from '../../crm/format';
import type { TimelineEvent, TimelineEventType } from '../../crm/types';
import { EmptyState } from './EmptyState';

const ICON: Record<TimelineEventType, { icon: string; className: string }> = {
  ProspectCreated: { icon: 'bi-flag', className: 'bg-brand-soft text-brand-stronger' },
  ProspectUpdated: { icon: 'bi-pencil', className: 'bg-accent text-muted-foreground' },
  ContactLinked: { icon: 'bi-person-plus', className: 'bg-info-soft text-info' },
  ActivityLogged: { icon: 'bi-chat-dots', className: 'bg-accent text-foreground' },
  TaskCreated: { icon: 'bi-check2-square', className: 'bg-warning-soft text-warning' },
  TaskCompleted: { icon: 'bi-check2-circle', className: 'bg-success-soft text-success' },
  MeetingScheduled: { icon: 'bi-calendar-event', className: 'bg-info-soft text-info' },
  SiteVisitCompleted: { icon: 'bi-geo-alt', className: 'bg-success-soft text-success' },
  RequirementSubmitted: { icon: 'bi-clipboard-check', className: 'bg-brand-soft text-brand-stronger' },
  DocumentUploaded: { icon: 'bi-paperclip', className: 'bg-accent text-foreground' },
  ProspectStatusChanged: { icon: 'bi-arrow-left-right', className: 'bg-warning-soft text-warning' },
  TemperatureChanged: { icon: 'bi-thermometer-half', className: 'bg-accent text-muted-foreground' },
  ProspectConverted: { icon: 'bi-trophy', className: 'bg-success-soft text-success' },
};

export function TimelineFeed({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon="bi-clock-history" title="No history yet" compact />;
  }

  return (
    <ol className="relative space-y-1">
      {events.map((e, i) => {
        const meta = ICON[e.eventType];
        return (
          <li key={e.id} className="relative flex gap-3 pb-3">
            {i < events.length - 1 && (
              <span className="absolute left-[15px] top-9 bottom-0 w-px bg-border" aria-hidden />
            )}
            <span
              className={cn(
                'z-10 grid size-8 shrink-0 place-items-center rounded-full text-[0.8rem]',
                meta.className,
              )}
            >
              <i className={`bi ${meta.icon}`} />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-[0.8125rem] font-medium text-foreground">{e.title}</p>
              {e.summary && (
                <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{e.summary}</p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">
                {e.actorName} · <span title={formatDateTime(e.occurredAt)}>{relativeTime(e.occurredAt)}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

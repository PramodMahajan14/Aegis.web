import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { Button, buttonVariants } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { EmptyState } from '../../components/crm/EmptyState';
import { PersonAvatar } from '../../components/crm/PersonAvatar';
import { StatusMenu } from '../../components/crm/StatusBadge';
import { TemperatureControl } from '../../components/crm/TemperatureControl';
import { useComposers } from '../../components/crm/useComposers';
import {
  ActivitiesPanel,
  ContactsPanel,
  DocumentsPanel,
  MeetingsPanel,
  OverviewPanel,
  RequirementsPanel,
  SiteVisitsPanel,
  TasksPanel,
  TimelinePanel,
} from '../../components/crm/detail/panels';
import { PageContainer } from '../../components/ui/PageContainer';
import { useProspectDetail } from '../../crm/hooks';
import { useCrmActions } from '../../crm/hooks';
import { formatDate, formatMoney } from '../../crm/format';
import { cn } from '../../lib/cn';
import type { ProspectStatus } from '../../crm/types';

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'bi-grid-1x2' },
  { key: 'contacts', label: 'Contacts', icon: 'bi-people' },
  { key: 'activities', label: 'Activities', icon: 'bi-chat-dots' },
  { key: 'tasks', label: 'Tasks', icon: 'bi-check2-square' },
  { key: 'meetings', label: 'Meetings', icon: 'bi-calendar-event' },
  { key: 'visits', label: 'Site visits', icon: 'bi-geo-alt' },
  { key: 'requirements', label: 'Requirements', icon: 'bi-clipboard-data' },
  { key: 'documents', label: 'Documents', icon: 'bi-folder' },
  { key: 'timeline', label: 'Timeline', icon: 'bi-clock-history' },
] as const;

export default function ProspectDetailPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const detail = useProspectDetail(id);
  const composers = useComposers();
  const { changeStatus, changeTemperature } = useCrmActions();

  if (!detail) {
    return (
      <PageContainer>
        <EmptyState
          icon="bi-folder-x"
          title="Prospect not found"
          description="It may have been removed."
          action={
            <Link to="/prospects" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Back to prospects
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const { prospect } = detail;
  const tab = (params.get('tab') as (typeof TABS)[number]['key']) || 'overview';
  const setTab = (t: string) => setParams((p) => {
    p.set('tab', t);
    return p;
  }, { replace: true });

  const counts: Record<string, number> = {
    contacts: detail.contacts.length,
    activities: detail.activities.length,
    tasks: detail.tasks.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
    meetings: detail.meetings.length,
    visits: detail.siteVisits.length,
    requirements: detail.requirementResponses.length,
    documents: detail.documents.length,
  };

  const panelProps = { detail, composers };
  const canConvert = prospect.status === 'QUALIFIED';

  return (
    <PageContainer>
      {/* Breadcrumb + quick nav */}
      <div className="mb-3 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
        <Link to="/prospects" className="hover:text-foreground">
          Prospects
        </Link>
        <i className="bi bi-chevron-right text-[0.65rem] opacity-60" />
        <span className="font-medium text-foreground">{prospect.name}</span>
      </div>

      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <PersonAvatar name={prospect.name} size="md" className="size-11 text-sm" />
            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-semibold tracking-tight text-foreground">
                {prospect.name}
              </h1>
              <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                {prospect.prospectNo}
                {prospect.businessName ? ` · ${prospect.businessName}` : ''}
                {prospect.projectLocation ? ` · ${prospect.projectLocation}` : ''}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <StatusMenu
                  status={prospect.status}
                  onChange={(t: ProspectStatus) => {
                    if (t === 'DISQUALIFIED') composers.changeStatus(prospect.id, t);
                    else changeStatus(prospect.id, t);
                  }}
                  onConvert={() => composers.convert(prospect.id)}
                />
                <TemperatureControl
                  size="sm"
                  value={prospect.temperature}
                  onChange={(t) => changeTemperature(prospect.id, t)}
                />
                {prospect.projectProgress && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">
                    <i className="bi bi-buildings" />
                    {prospect.projectProgress}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canConvert && (
              <Button size="sm" onClick={() => composers.convert(prospect.id)}>
                <i className="bi bi-trophy" /> Convert
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => composers.editProspect(prospect)}>
              <i className="bi bi-pencil" /> Edit
            </Button>
            <Popover
              placement="bottom-end"
              content={
                <Menu>
                  <MenuItem icon="chat" text="Log activity" onClick={() => composers.logActivity(prospect.id)} />
                  <MenuItem icon="tick" text="Add task" onClick={() => composers.addTask(prospect.id)} />
                  <MenuItem icon="calendar" text="Schedule meeting" onClick={() => composers.scheduleMeeting(prospect.id)} />
                  <MenuItem icon="map-marker" text="Start site visit" onClick={() => composers.startSiteVisit(prospect.id)} />
                  <MenuDivider />
                  <MenuItem icon="new-person" text="Add contact" onClick={() => composers.addContact(prospect.id)} />
                  <MenuItem icon="form" text="Capture requirement" onClick={() => composers.captureRequirement(prospect.id)} />
                  <MenuItem icon="upload" text="Upload document" onClick={() => composers.uploadDocument(prospect.id)} />
                </Menu>
              }
            >
              <IconButton aria-label="More actions">
                <i className="bi bi-three-dots" />
              </IconButton>
            </Popover>
          </div>
        </div>

        {/* facts strip */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-4 text-[0.8125rem] sm:grid-cols-4">
          {[
            ['Owner', prospect.ownerName],
            ['Est. value', formatMoney(prospect.estimatedValue)],
            ['Expected decision', formatDate(prospect.expectedDecisionDate)],
            ['Source', prospect.source ?? '—'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="font-medium text-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick capture bar */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: 'Log activity', icon: 'bi-chat-dots', fn: () => composers.logActivity(prospect.id) },
          { label: 'Add task', icon: 'bi-check2-square', fn: () => composers.addTask(prospect.id) },
          { label: 'Meeting', icon: 'bi-calendar-event', fn: () => composers.scheduleMeeting(prospect.id) },
          { label: 'Site visit', icon: 'bi-geo-alt', fn: () => composers.startSiteVisit(prospect.id) },
          { label: 'Contact', icon: 'bi-person-plus', fn: () => composers.addContact(prospect.id) },
          { label: 'Document', icon: 'bi-upload', fn: () => composers.uploadDocument(prospect.id) },
        ].map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.fn}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-brand hover:bg-accent"
          >
            <i className={`bi ${a.icon} text-brand-strong`} />
            {a.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mt-5 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              '-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[0.8125rem] font-medium transition-colors',
              tab === t.key
                ? 'border-brand text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <i className={`bi ${t.icon}`} />
            {t.label}
            {counts[t.key] ? (
              <span className="rounded-full bg-accent px-1.5 text-[0.6875rem] text-muted-foreground">
                {counts[t.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'overview' && <OverviewPanel {...panelProps} />}
        {tab === 'contacts' && <ContactsPanel {...panelProps} />}
        {tab === 'activities' && <ActivitiesPanel {...panelProps} />}
        {tab === 'tasks' && <TasksPanel {...panelProps} />}
        {tab === 'meetings' && <MeetingsPanel {...panelProps} />}
        {tab === 'visits' && <SiteVisitsPanel {...panelProps} />}
        {tab === 'requirements' && <RequirementsPanel {...panelProps} />}
        {tab === 'documents' && <DocumentsPanel {...panelProps} />}
        {tab === 'timeline' && <TimelinePanel {...panelProps} />}
      </div>
    </PageContainer>
  );
}

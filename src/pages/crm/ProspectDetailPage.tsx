import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { Button, buttonVariants } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { EmptyState } from '../../components/crm/EmptyState';
import { PersonAvatar } from '../../components/crm/PersonAvatar';
import { StatusMenu } from '../../components/crm/StatusBadge';
import { TemperatureControl } from '../../components/crm/TemperatureControl';
import { useComposers } from '../../components/crm/useComposers';
import { Block, Page, PageBar, PageContent, PageTabs, Section, SectionGrid } from '../../components/ui/Page';
import { Spinner } from '../../components/ui/Spinner';
import { formatDate, formatMoney } from '../../crm/format';
import type { ProspectStatus, Temperature } from '../../crm/types';
import {
  useChangeProspectStatus,
  useChangeProspectTemperature,
  useProspect,
} from '../../hooks/Prospect/useProspect';
import type { ChangeStatusPayload, ChangeTemplatePayload } from '../../hooks/Prospect/ProspectType';
import { useGetTemperatures, useProspectStatusList } from '../../hooks/Master/useMaster';
import { useToast } from '../../Services/ToastServices';
import ContactTab from '../../components/Contact/ContactTab';

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
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const { data: detail, isLoading } = useProspect(id || '');
  const { data: status } = useProspectStatusList();
  const { data: temperatures } = useGetTemperatures();
  const composers = useComposers();

  const { mutateAsync: changeStatus, isPending: isPendingStatusChanging } = useChangeProspectStatus();
  const { mutateAsync: changeTemperature, isPending: isPendingTemperatureChanging } =
    useChangeProspectTemperature();

  const handleStatusChange = (code: ProspectStatus) => {
    if (!detail || !status || status.length == 0) return;
    const targetStatus = status.find((s) => s.code == code);
    if (!targetStatus || !targetStatus.id) return toast.error('Invalid status');
    if (code === 'DISQUALIFIED') composers.changeStatus(detail.id, code);
    else {
      let statusPaylaod: ChangeStatusPayload = [
        {
          path: '/StatusId',
          op: 'replace',
          value: targetStatus.id,
          from: detail?.status.id,
        },
      ];
      changeStatus({ id: detail?.id, prospect: statusPaylaod });
    }
  };

  const handleTemperatureChange = (code: Temperature) => {
    if (!detail || !temperatures || temperatures.length == 0) return;
    const targetTemp = temperatures.find((temp) => temp.code == code);

    if (!targetTemp || !targetTemp.id) return toast.error('Invalid Temperature');
    let temperaturePaylaod: ChangeTemplatePayload = [
      {
        path: '/ProspectTemperatureId',
        op: 'replace',
        value: targetTemp.id,
        from: detail?.temperature.id,
      },
    ];
    changeTemperature({ id: detail?.id, prospect: temperaturePaylaod });
  };

  if (isLoading) {
    return (
      <Page>
        <div className="grid flex-1 place-items-center py-24">
          <Spinner className="size-6" />
        </div>
      </Page>
    );
  }
  if (!detail) {
    return (
      <Page>
        <PageContent>
          <Block>
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
          </Block>
        </PageContent>
      </Page>
    );
  }

  const tab = (params.get('tab') as (typeof TABS)[number]['key']) || 'overview';
  const setTab = (t: string) =>
    setParams(
      (p) => {
        p.set('tab', t);
        return p;
      },
      { replace: true },
    );

  const facts: [string, string][] = [
    ['Est. value', formatMoney(detail.estimatedValue)],
    ['Expected decision', formatDate(detail.expectedDecisionDate)],
    ['Source', detail.source?.name ?? '—'],
    ['Project stage', detail.progress?.name ?? '—'],
    ['Created', formatDate(detail.createdAt)],
  ];

  const capture = [
    { label: 'Log activity', icon: 'bi-chat-dots', fn: () => composers.logActivity(detail.id) },
    { label: 'Task', icon: 'bi-check2-square', fn: () => composers.addTask(detail.id) },
    { label: 'Meeting', icon: 'bi-calendar-event', fn: () => composers.scheduleMeeting(detail.id) },
    { label: 'Site visit', icon: 'bi-geo-alt', fn: () => composers.startSiteVisit(detail.id) },
    { label: 'Contact', icon: 'bi-person-plus', fn: () => composers.addContact(undefined, detail.id) },
    { label: 'Document', icon: 'bi-upload', fn: () => composers.uploadDocument(detail.id) },
  ];

  return (
    <Page>
      <PageBar
        back={{ to: '/prospects', label: 'Prospects' }}
        leading={<PersonAvatar name={detail.name} size="md" className="size-11 text-sm" />}
        title={detail.name}
        description={[detail.prospectNo, detail.businessName, detail.location].filter(Boolean).join(' · ')}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => detail.id && composers.editProspect(detail.id)}
            >
              <i className="bi bi-pencil" /> Edit
            </Button>
            <Popover
              placement="bottom-end"
              content={
                <Menu>
                  <MenuItem
                    icon="chat"
                    text="Log activity"
                    onClick={() => composers.logActivity(detail.id)}
                  />
                  <MenuItem icon="tick" text="Add task" onClick={() => composers.addTask(detail.id)} />
                  <MenuItem
                    icon="calendar"
                    text="Schedule meeting"
                    onClick={() => composers.scheduleMeeting(detail.id)}
                  />
                  <MenuItem
                    icon="map-marker"
                    text="Start site visit"
                    onClick={() => composers.startSiteVisit(detail.id)}
                  />
                  <MenuDivider />
                  <MenuItem
                    icon="new-person"
                    text="Add contact"
                    onClick={() => composers.addContact(undefined, detail.id)}
                  />
                  <MenuItem
                    icon="form"
                    text="Capture requirement"
                    onClick={() => composers.captureRequirement(detail.id)}
                  />
                  <MenuItem
                    icon="upload"
                    text="Upload document"
                    onClick={() => composers.uploadDocument(detail.id)}
                  />
                </Menu>
              }
            >
              <IconButton aria-label="More actions">
                <i className="bi bi-three-dots" />
              </IconButton>
            </Popover>
          </>
        }
      >
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <StatusMenu
            status={detail.status.code as ProspectStatus}
            isChangingStatus={isPendingStatusChanging}
            onChange={(t: ProspectStatus) => handleStatusChange(t)}
            onConvert={() => composers.convert(detail.id)}
          />
          <TemperatureControl
            size="sm"
            value={detail.temperature.code as Temperature}
            onChange={(t) => handleTemperatureChange(t)}
            isChanging={isPendingTemperatureChanging}
          />
        </div>
      </PageBar>

      {/* Facts */}
      <dl className="grid grid-cols-2 border-b border-border bg-surface sm:grid-cols-3 xl:grid-cols-5">
        {facts.map(([k, v]) => (
          <div key={k} className="border-border px-5 py-3 [&:not(:last-child)]:border-r">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 truncate text-[0.875rem] font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Quick capture */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface px-3.5 py-1.5">
        <span className="px-1.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
          Capture
        </span>
        {capture.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.fn}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <i className={`bi ${a.icon}`} />
            {a.label}
          </button>
        ))}
      </div>

      <PageTabs
        tabs={TABS.map((t) => ({ key: t.key, label: t.label, icon: t.icon }))}
        value={tab}
        onChange={setTab}
      />

      <PageContent>
        {tab === 'overview' && (
          <SectionGrid className="lg:grid-cols-3">
            <Section className="lg:col-span-2" title="About this pursuit">
              <p className="whitespace-pre-line text-[0.8125rem] leading-relaxed text-muted-foreground">
                {detail.description || 'No description yet.'}
              </p>
            </Section>
            <Section title="Details" bodyClassName="pt-0">
              <dl className="divide-y divide-border/70 text-[0.8125rem]">
                {[
                  ['Project location', detail.location],
                  ['Office location', detail.officeLocation],
                  ['Business', detail.businessName],
                  ['Last updated', detail.updatedAt ? formatDate(detail.updatedAt) : undefined],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium text-foreground">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </SectionGrid>
        )}
        {tab === 'contacts' && id && (
          <ContactTab ProspectId={id} />
        )}
        {tab !== 'overview' && tab !== 'contacts' && (
          <Block>
            <EmptyState
              icon={TABS.find((t) => t.key === tab)?.icon}
              title={`${TABS.find((t) => t.key === tab)?.label} — not connected yet`}
              description="This tab will show data once its API is wired up."
            />
          </Block>
        )}
      </PageContent>
    </Page>
  );
}

import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWindowStore } from '../../store/useWindowStore';
import { useConfirmStore } from '../../store/useConfirmStore';
import {
  useDeleteJobeRole,
  useDeleteProjectStage,
  useGetJobeRoles,
  useGetProjectStages,
} from '../../hooks/Master/useMaster';
import { JobRoleModal } from '../../components/Master/JobRoleModal';
import { ProjectStageModal } from '../../components/Master/ProjectStageModal';
import { ApplicationRoleModal } from '../../components/Master/ApplicationRoleModal';
import type { ApplicationRoleFormData } from '../../components/Master/MasterSchemas';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { TableWrap, Table, THead, TBody, EmptyRow } from '../../components/ui/Table';
import {
  Block,
  PageContent,
  Page,
  PageBar,
  PageTabs,
  PageToolbar,
  ToolbarSearch,
  denseHead,
} from '../../components/ui/Page';
import { cn } from '../../lib/cn';

// Application roles have no API yet — local sample data until the endpoint lands.
const APP_ROLES: ApplicationRoleFormData[] = [
  { id: 1, roleName: 'System Admin', accessLevel: 'Admin', isActive: true },
  { id: 2, roleName: 'HR Manager', accessLevel: 'Manager', isActive: true },
  { id: 3, roleName: 'Employee', accessLevel: 'User', isActive: true },
];

type TabKey = 'job-roles' | 'project-stages' | 'app-roles';

interface Row {
  key: string;
  name: string;
  description?: ReactNode;
  active: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}

interface ListConfig {
  key: TabKey;
  label: string;
  singular: string;
  icon: string;
  description: string;
  columnLabel: string;
  rows: Row[];
  isLoading: boolean;
  isError: boolean;
  onAdd: () => void;
  note?: string;
}

export default function MasterDashboard() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const { openWindow } = useWindowStore();
  const { openConfirm } = useConfirmStore();

  const jobRoles = useGetJobeRoles();
  const stages = useGetProjectStages();
  const deleteJobRole = useDeleteJobeRole();
  const deleteStage = useDeleteProjectStage();

  const confirmDelete = (what: string, name: string, run: () => Promise<unknown>) =>
    openConfirm({
      cancelButtonText: 'Cancel',
      confirmButtonText: `Delete ${what}`,
      icon: 'trash',
      intent: 'danger',
      content: (
        <p>
          Are you sure you want to delete <b>{name}</b>? This action cannot be undone.
        </p>
      ),
      onConfirm: async () => {
        await run();
      },
    });

  const openJobRole = (role?: { id?: string; name?: string; description?: string }) =>
    openWindow({
      id: 'modal-job-role',
      title: role ? 'Edit Job Role' : 'Create Job Role',
      icon: 'briefcase',
      width: 500,
      content: <JobRoleModal windowId="modal-job-role" initialData={role} />,
    });

  const openStage = (stage?: { id?: string; name?: string; description?: string }) =>
    openWindow({
      id: 'modal-project-stage',
      title: stage ? 'Edit Project Stage' : 'Create Project Stage',
      icon: 'flow-linear',
      width: 500,
      content: <ProjectStageModal windowId="modal-project-stage" initialData={stage} />,
    });

  const openAppRole = (role?: ApplicationRoleFormData) =>
    openWindow({
      id: 'modal-app-role',
      title: role ? 'Edit Application Role' : 'Create Application Role',
      icon: 'badge',
      width: 500,
      content: <ApplicationRoleModal windowId="modal-app-role" initialData={role} />,
    });

  const lists: ListConfig[] = [
    {
      key: 'job-roles',
      label: 'Job Roles',
      singular: 'job role',
      icon: 'bi-briefcase',
      description: 'Designations assigned to employees.',
      columnLabel: 'Description',
      isLoading: jobRoles.isLoading,
      isError: jobRoles.isError,
      onAdd: () => openJobRole(),
      rows: (jobRoles.data ?? []).map((r) => ({
        key: String(r.id ?? r.name),
        name: r.name,
        description: r.description,
        active: true,
        onEdit: () => openJobRole(r),
        onDelete: () => confirmDelete('Role', r.name, () => deleteJobRole.mutateAsync(r.id!)),
      })),
    },
    {
      key: 'project-stages',
      label: 'Project Stages',
      singular: 'project stage',
      icon: 'bi-kanban',
      description: 'Construction stages a prospect’s project can be at.',
      columnLabel: 'Description',
      isLoading: stages.isLoading,
      isError: stages.isError,
      onAdd: () => openStage(),
      rows: (stages.data ?? []).map((s) => ({
        key: String(s.id ?? s.name),
        name: s.name,
        description: s.description,
        active: true,
        onEdit: () => openStage(s),
        onDelete: () => confirmDelete('Stage', s.name, () => deleteStage.mutateAsync(s.id!)),
      })),
    },
    {
      key: 'app-roles',
      label: 'Application Roles',
      singular: 'application role',
      icon: 'bi-person-badge',
      description: 'Permission levels that control what users can access.',
      columnLabel: 'Access level',
      isLoading: false,
      isError: false,
      onAdd: () => openAppRole(),
      note: 'Sample data — not yet connected to the API.',
      rows: APP_ROLES.map((r) => ({
        key: String(r.id),
        name: r.roleName,
        description: (
          <span className="inline-flex items-center gap-1.5">
            <i className="bi bi-lock text-xs" /> {r.accessLevel}
          </span>
        ),
        active: r.isActive,
        onEdit: () => openAppRole(r),
      })),
    },
  ];

  const tabKey = (params.get('tab') as TabKey) ?? 'job-roles';
  const current = lists.find((l) => l.key === tabKey) ?? lists[0];

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return current.rows;
    return current.rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (typeof r.description === 'string' && r.description.toLowerCase().includes(q)),
    );
  }, [current, search]);

  function selectTab(key: TabKey) {
    setSearch('');
    setParams(
      (p) => {
        p.set('tab', key);
        return p;
      },
      { replace: true },
    );
  }

  return (
    <Page>
      <PageBar
        title="Master data"
        description="Reference lists that power roles, permissions and the sales workflow."
      />

      <PageContent>
        <Block>
          <PageTabs
            tabs={lists.map((l) => ({
              key: l.key,
              label: l.label,
              icon: l.icon,
              count: l.isLoading ? undefined : l.rows.length,
            }))}
            value={current.key}
            onChange={selectTab}
          />

          <PageToolbar className="gap-3">
            <ToolbarSearch
              value={search}
              onChange={setSearch}
              placeholder={`Search ${current.label.toLowerCase()}`}
            />
            <span className="hidden text-xs text-muted-foreground md:inline">{current.description}</span>
            <Button variant="subtle" size="sm" className="ml-auto" onClick={current.onAdd}>
              <i className="bi bi-plus-lg" />
              Add {current.singular}
            </Button>
          </PageToolbar>

          {current.note && (
            <div className="mx-5 mb-3 flex items-center gap-2 rounded-sm bg-warning-soft px-3 py-1.5 text-xs text-warning">
              <i className="bi bi-info-circle" /> {current.note}
            </div>
          )}

          {/* Table */}
          <TableWrap>
            <Table>
              <THead className={denseHead}>
                <tr>
                  <th className="w-12 !pl-5">#</th>
                  <th className="w-[28%]">Name</th>
                  <th>{current.columnLabel}</th>
                  <th className="w-28">Status</th>
                  <th className="w-24 !pr-5 !text-right">Actions</th>
                </tr>
              </THead>
              <TBody className="[&_td]:py-2.5 [&_tr]:border-border/70">
                {current.isLoading && (
                  <EmptyRow colSpan={5}>
                    <Spinner className="mx-auto size-5" />
                  </EmptyRow>
                )}
                {current.isError && (
                  <EmptyRow colSpan={5}>
                    <i className="bi bi-exclamation-triangle mb-2 block text-2xl text-danger opacity-70" />
                    <p className="font-medium text-foreground">Couldn’t load {current.label.toLowerCase()}</p>
                    <p className="text-sm">Check your connection and refresh the page.</p>
                  </EmptyRow>
                )}
                {!current.isLoading &&
                  !current.isError &&
                  rows.map((r, i) => (
                    <tr key={r.key} className="group">
                      <td className="!pl-5 text-xs tabular-nums text-muted-foreground">{i + 1}</td>
                      <td className="font-medium text-foreground">{r.name}</td>
                      <td className="text-muted-foreground">{r.description || '—'}</td>
                      <td>
                        <Badge variant={r.active ? 'success' : 'neutral'}>
                          {r.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="!pr-5">
                        <div className="flex justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            title="Edit"
                            aria-label={`Edit ${r.name}`}
                            onClick={r.onEdit}
                            className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            <i className="bi bi-pencil text-[0.8rem]" />
                          </button>
                          {r.onDelete && (
                            <button
                              type="button"
                              title="Delete"
                              aria-label={`Delete ${r.name}`}
                              onClick={r.onDelete}
                              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-danger-soft hover:text-danger"
                            >
                              <i className="bi bi-trash text-[0.8rem]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {!current.isLoading && !current.isError && rows.length === 0 && (
                  <EmptyRow colSpan={5}>
                    <i
                      className={cn('bi mb-2 block text-2xl opacity-40', search ? 'bi-search' : current.icon)}
                    />
                    <p className="font-medium text-foreground">
                      {search ? 'No matches' : `No ${current.label.toLowerCase()} yet`}
                    </p>
                    <p className="text-sm">
                      {search
                        ? 'Try a different search.'
                        : `Add your first ${current.singular} to get started.`}
                    </p>
                  </EmptyRow>
                )}
              </TBody>
            </Table>
          </TableWrap>
        </Block>
      </PageContent>
    </Page>
  );
}

import { useState } from 'react';
import { Drawer, Position } from '@blueprintjs/core';
import { useWindowStore } from '../../store/useWindowStore';
import { useConfirmStore } from '../../store/useConfirmStore';
import { JobRoleModal } from './JobRoleModal';
import { useGetJobeRoles, useDeleteJobeRole } from '../../hooks/Master/useMaster';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';

export function JobRolesCard() {
  const { openWindow } = useWindowStore();
  const { data: jobRoles, isLoading, isError } = useGetJobeRoles();
  const deleteJobRole = useDeleteJobeRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { openConfirm } = useConfirmStore();

  const openModal = (role?: { id?: string; name?: string; description?: string; isActive?: boolean }) => {
    setIsDrawerOpen(false);
    const windowId = 'modal-job-role';
    openWindow({
      id: windowId,
      title: role ? 'Edit Job Role' : 'Create Job Role',
      icon: 'briefcase',
      width: 500,
      content: <JobRoleModal windowId={windowId} initialData={role} />,
    });
  };

  const confirmDelete = (role: { id?: string; name: string }) =>
    openConfirm({
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete Role',
      icon: 'trash',
      intent: 'danger',
      content: (
        <p>
          Are you sure you want to delete <b>{role.name}</b>? This action cannot be undone.
        </p>
      ),
      onConfirm: async () => {
        if (role.id) await deleteJobRole.mutateAsync(role.id);
      },
    });

  return (
    <>
      <Card className="h-full">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-[0.9375rem] font-semibold">
            <i className="bi bi-briefcase text-muted-foreground" /> Job Roles
          </h3>
          <Button size="sm" onClick={() => openModal()}>
            <i className="bi bi-plus-lg" /> Add
          </Button>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Spinner className="size-5" />
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-sm text-danger">Failed to load job roles</div>
          ) : (jobRoles ?? []).slice(0, 5).map((role) => (
            <div key={role.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{role.name}</div>
                <div className="truncate text-[0.8125rem] text-muted-foreground">
                  {role.description}
                </div>
              </div>
              <Badge variant="success" dot>
                Active
              </Badge>
            </div>
          ))}
          {!isLoading && !isError && (jobRoles ?? []).length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No job roles found.</div>
          )}
        </div>

        <button
          className="border-t border-border bg-surface-2 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setIsDrawerOpen(true)}
        >
          View all job roles
        </button>
      </Card>

      <Drawer
        icon="briefcase"
        title="All Job Roles"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={Position.RIGHT}
        size="480px"
      >
        <div className="p-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => openModal()}>
              <i className="bi bi-plus-lg" /> Add Job Role
            </Button>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border">
            {(jobRoles ?? []).map((role) => (
              <div key={role.id} className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">{role.name}</div>
                  <div className="text-[0.8125rem] text-muted-foreground">{role.description}</div>
                  <Badge variant="success" dot className="mt-1.5">
                    Active
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <IconButton size="sm" title="Edit role" onClick={() => openModal(role)}>
                    <i className="bi bi-pencil" />
                  </IconButton>
                  <IconButton
                    size="sm"
                    title="Delete role"
                    className="hover:text-danger"
                    onClick={() => confirmDelete(role)}
                  >
                    <i className="bi bi-trash" />
                  </IconButton>
                </div>
              </div>
            ))}
            {(jobRoles ?? []).length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">No job roles found.</div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}

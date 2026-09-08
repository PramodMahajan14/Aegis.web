import { useState } from 'react';
import { Alert, Drawer, Position } from '@blueprintjs/core';
import { useWindowStore } from '../../store/useWindowStore';
import { ApplicationRoleModal } from './ApplicationRoleModal';
import { type ApplicationRoleFormData } from './MasterSchemas';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Badge } from '../ui/Badge';

const DUMMY_APP_ROLES: ApplicationRoleFormData[] = [
  { id: 1, roleName: 'System Admin', accessLevel: 'Admin', isActive: true },
  { id: 2, roleName: 'HR Manager', accessLevel: 'Manager', isActive: true },
  { id: 3, roleName: 'Employee', accessLevel: 'User', isActive: true },
];

export function ApplicationRolesCard() {
  const { openWindow } = useWindowStore();
  const [appRoles] = useState<ApplicationRoleFormData[]>(DUMMY_APP_ROLES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<ApplicationRoleFormData | null>(null);

  const openModal = (role?: ApplicationRoleFormData) => {
    setIsDrawerOpen(false);
    const windowId = 'modal-app-role';
    openWindow({
      id: windowId,
      title: role ? 'Edit Application Role' : 'Create Application Role',
      icon: 'badge',
      width: 500,
      content: <ApplicationRoleModal windowId={windowId} initialData={role} />,
    });
  };

  const RoleRow = ({ role }: { role: ApplicationRoleFormData }) => (
    <div className="min-w-0">
      <div className="font-semibold text-foreground">{role.roleName}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
        <i className="bi bi-lock text-xs" /> {role.accessLevel}
      </div>
    </div>
  );

  return (
    <>
      <Card className="h-full">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-[0.9375rem] font-semibold">
            <i className="bi bi-person-badge text-muted-foreground" /> Application Roles
          </h3>
          <Button size="sm" onClick={() => openModal()}>
            <i className="bi bi-plus-lg" /> Add
          </Button>
        </div>

        <div className="divide-y divide-border">
          {appRoles.slice(0, 5).map((role) => (
            <div key={role.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <RoleRow role={role} />
              <Badge variant={role.isActive ? 'success' : 'neutral'} dot>
                {role.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          ))}
        </div>

        {appRoles.length > 5 && (
          <button
            className="border-t border-border bg-surface-2 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsDrawerOpen(true)}
          >
            View all app roles
          </button>
        )}
      </Card>

      <Drawer
        icon="badge"
        title="All Application Roles"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={Position.RIGHT}
        size="480px"
      >
        <div className="p-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => openModal()}>
              <i className="bi bi-plus-lg" /> Add Application Role
            </Button>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border">
            {appRoles.map((role) => (
              <div key={role.id} className="flex items-start justify-between gap-3 p-3">
                <div>
                  <RoleRow role={role} />
                  <Badge variant={role.isActive ? 'success' : 'neutral'} dot className="mt-1.5">
                    {role.isActive ? 'Active' : 'Inactive'}
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
                    onClick={() => setRoleToDelete(role)}
                  >
                    <i className="bi bi-trash" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Delete Role"
        icon="trash"
        intent="danger"
        isOpen={!!roleToDelete}
        onCancel={() => setRoleToDelete(null)}
        onConfirm={() => setRoleToDelete(null)}
      >
        <p>
          Are you sure you want to delete <b>{roleToDelete?.roleName}</b>? This action cannot be
          undone.
        </p>
      </Alert>
    </>
  );
}

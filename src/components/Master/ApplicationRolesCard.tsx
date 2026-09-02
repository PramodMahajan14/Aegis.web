import { useState } from 'react';
import { Icon, Drawer, Position, Button, Intent, Alert } from '@blueprintjs/core';
import { useWindowStore } from '../../store/useWindowStore';
import { ApplicationRoleModal } from './ApplicationRoleModal';
import { type ApplicationRoleFormData } from './MasterSchemas';

const DUMMY_APP_ROLES: ApplicationRoleFormData[] = [
  { id: 1, roleName: 'System Admin', accessLevel: 'Admin', isActive: true },
  { id: 2, roleName: 'HR Manager', accessLevel: 'Manager', isActive: true },
  { id: 3, roleName: 'Employee', accessLevel: 'User', isActive: true },
];

export function ApplicationRolesCard() {
  const { openWindow } = useWindowStore();
  const [appRoles] = useState<ApplicationRoleFormData[]>(DUMMY_APP_ROLES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);

  const handleOpenAppRoleModal = (role?: any) => {
    setIsDrawerOpen(false); // Close drawer so modal isn't behind it
    const windowId = 'modal-app-role';
    openWindow({
      id: windowId,
      title: role ? 'Edit Application Role' : 'Create Application Role',
      icon: 'badge',
      width: 500,
      content: <ApplicationRoleModal windowId={windowId} initialData={role} />
    });
  };

  return (
    <>
      <div className="aegis-card h-100">
      <div className="aegis-card-header border-bottom pb-3 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 d-flex align-items-center">
          <Icon icon="badge" className="me-2 text-muted" />
          Application Roles
        </h6>
        <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={handleOpenAppRoleModal}>
          <Icon icon="plus" size={12} className="me-1" /> Add
        </button>
      </div>
      <div className="aegis-card-body p-0">
        <div className="list-group list-group-flush border-0">
          {appRoles.slice(0, 5).map(role => (
            <div key={role.id} className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-3">
              <div>
                <div className="fw-semibold text-strong">{role.roleName}</div>
                <div className="small text-muted d-flex align-items-center mt-1">
                  <Icon icon="lock" size={10} className="me-1" /> {role.accessLevel}
                </div>
              </div>
              <div>
                {role.isActive ? (
                  <span className="badge bg-success-subtle text-success">Active</span>
                ) : (
                  <span className="badge bg-secondary-subtle text-secondary">Inactive</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div 
        className="aegis-card-footer border-top bg-light pt-2 pb-2 text-center text-muted small cursor-pointer hover-bg-gray"
        onClick={() => setIsDrawerOpen(true)}
      >
        View All App Roles
      </div>
    </div>

      <Drawer
        icon="badge"
        title="All Application Roles"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={Position.RIGHT}
        size={Drawer.SIZE_LARGE}
      >
        <div className="p-3">
          <div className="d-flex justify-content-end mb-3">
            <Button intent={Intent.PRIMARY} icon="plus" onClick={handleOpenAppRoleModal}>
              Add Application Role
            </Button>
          </div>
          <div className="list-group">
            {appRoles.map(role => (
              <div key={role.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                  <div className="fw-semibold text-strong">{role.roleName}</div>
                  <div className="small text-muted d-flex align-items-center mt-1">
                    <Icon icon="lock" size={10} className="me-1" /> {role.accessLevel}
                  </div>
                  <div className="mt-1">
                    {role.isActive ? (
                      <span className="badge bg-success-subtle text-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary">Inactive</span>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button icon="edit" minimal title="Edit Role" onClick={() => handleOpenAppRoleModal(role)} />
                  <Button icon="trash" intent={Intent.DANGER} minimal title="Delete Role" onClick={() => setRoleToDelete(role)} />
                </div>
              </div>
            ))}
            {appRoles.length === 0 && (
              <div className="p-4 text-center text-muted">No application roles found.</div>
            )}
          </div>
        </div>
      </Drawer>

      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Delete Role"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={!!roleToDelete}
        onCancel={() => setRoleToDelete(null)}
        onConfirm={() => {
          // TODO: implement delete mutation
          console.log("Deleted", roleToDelete);
          setRoleToDelete(null);
        }}
      >
        <p>
          Are you sure you want to delete <b>{roleToDelete?.roleName}</b>? This action cannot be undone.
        </p>
      </Alert>
    </>
  );
}

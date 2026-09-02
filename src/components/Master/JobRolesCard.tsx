import { useState } from 'react';
import { Icon, Spinner, Drawer, Position, Button, Intent, Alert } from '@blueprintjs/core';
import { useWindowStore } from '../../store/useWindowStore';
import { JobRoleModal } from './JobRoleModal';
import { useGetJobeRoles, useDeleteJobeRole } from '../../hooks/Master/useMaster';

export function JobRolesCard() {
  const { openWindow } = useWindowStore();
  const { data: jobRoles, isLoading: isLoadingJobRoles, isError: isJobRolesError } = useGetJobeRoles();
  const deleteJobRole = useDeleteJobeRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);

  const handleOpenJobRoleModal = (role?: any) => {
    setIsDrawerOpen(false); // Close drawer so modal isn't behind it
    const windowId = 'modal-job-role';
    openWindow({
      id: windowId,
      title: role ? 'Edit Job Role' : 'Create Job Role',
      icon: 'briefcase',
      width: 500,
      content: <JobRoleModal windowId={windowId} initialData={role} />
    });
  };

  return (
    <>
      <div className="aegis-card h-100">
      <div className="aegis-card-header border-bottom pb-3 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 d-flex align-items-center">
          <Icon icon="briefcase" className="me-2 text-muted" />
          Job Roles
        </h6>
        <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={handleOpenJobRoleModal}>
          <Icon icon="plus" size={12} className="me-1" /> Add
        </button>
      </div>
      <div className="aegis-card-body p-0">
        <div className="list-group list-group-flush border-0">
          {isLoadingJobRoles ? (
            <div className="p-4 text-center"><Spinner size={24} /></div>
          ) : isJobRolesError ? (
            <div className="p-4 text-center text-danger">Failed to load job roles</div>
          ) : jobRoles?.slice(0, 5).map(role => (
            <div key={role.id} className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-3">
              <div>
                <div className="fw-semibold text-strong">{role.name}</div>
                <div className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
                  {role.description}
                </div>
              </div>
              <div>
                <span className="badge bg-success-subtle text-success">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div 
        className="aegis-card-footer border-top bg-light pt-2 pb-2 text-center text-muted small cursor-pointer hover-bg-gray"
        onClick={() => setIsDrawerOpen(true)}
      >
        View All Job Roles
      </div>
    </div>

      <Drawer
        icon="briefcase"
        title="All Job Roles"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={Position.RIGHT}
        size={Drawer.SIZE_LARGE}
      >
        <div className="p-3">
          <div className="d-flex justify-content-end mb-3">
            <Button intent={Intent.PRIMARY} icon="plus" onClick={handleOpenJobRoleModal}>
              Add Job Role
            </Button>
          </div>
          <div className="list-group">
            {isLoadingJobRoles ? (
              <div className="p-4 text-center"><Spinner size={24} /></div>
            ) : isJobRolesError ? (
              <div className="p-4 text-center text-danger">Failed to load job roles</div>
            ) : jobRoles?.map(role => (
              <div key={role.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                  <div className="fw-semibold text-strong">{role.name}</div>
                  <div className="small text-muted">{role.description}</div>
                  <div className="mt-1">
                    <span className="badge bg-success-subtle text-success">Active</span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button icon="edit" minimal title="Edit Role" onClick={() => handleOpenJobRoleModal(role)} />
                  <Button icon="trash" intent={Intent.DANGER} minimal title="Delete Role" onClick={() => setRoleToDelete(role)} />
                </div>
              </div>
            ))}
            {jobRoles?.length === 0 && (
              <div className="p-4 text-center text-muted">No job roles found.</div>
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
        onConfirm={async () => {
          if (roleToDelete?.id) {
            try {
              await deleteJobRole.mutateAsync(roleToDelete.id);
              setRoleToDelete(null);
            } catch (error) {
              console.error("Failed to delete role:", error);
            }
          }
        }}
      >
        <p>
          Are you sure you want to delete <b>{roleToDelete?.name}</b>? This action cannot be undone.
        </p>
      </Alert>
    </>
  );
}

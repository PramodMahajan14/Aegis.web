import { useState } from 'react';
import { Icon, Spinner } from '@blueprintjs/core';
import PageHeader from '../../components/Layout/PageHeader';
import { useWindowStore } from '../../store/useWindowStore';
import { JobRoleModal } from '../../components/Master/JobRoleModal';
import { ApplicationRoleModal } from '../../components/Master/ApplicationRoleModal';
import { type ApplicationRoleFormData } from '../../components/Master/MasterSchemas';
import { useGetJobeRoles } from '../../hooks/Master/useMaster';

const DUMMY_APP_ROLES: ApplicationRoleFormData[] = [
  { id: 1, roleName: 'System Admin', accessLevel: 'Admin', isActive: true },
  { id: 2, roleName: 'HR Manager', accessLevel: 'Manager', isActive: true },
  { id: 3, roleName: 'Employee', accessLevel: 'User', isActive: true },
];

export default function MasterDashboard() {
  const { openWindow } = useWindowStore();

  // Local state for demonstration purposes
  const [appRoles] = useState<ApplicationRoleFormData[]>(DUMMY_APP_ROLES);

  const { data: jobRoles, isLoading: isLoadingJobRoles, isError: isJobRolesError } = useGetJobeRoles();
  console.log(jobRoles)
  const handleOpenJobRoleModal = () => {
    const windowId = 'modal-job-role';
    openWindow({
      id: windowId,
      title: 'Create Job Role',
      icon: 'briefcase',
      width: 500,
      content: <JobRoleModal windowId={windowId} />
    });
  };

  const handleOpenAppRoleModal = () => {
    const windowId = 'modal-app-role';
    openWindow({
      id: windowId,
      title: 'Create Application Role',
      icon: 'badge',
      width: 500,
      content: <ApplicationRoleModal windowId={windowId} />
    });
  };

  return (
    <div className="d-flex flex-column p-4 w-100">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <PageHeader crumbs={['Administrator', 'Master Data']} />
      </div>

      <div className="row g-4">

        {/* Job Roles Card */}
        <div className="col-md-6 col-xl-4">
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
                ) : jobRoles?.map(role => (
                  <div key={role.Id} className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-3">
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
            <div className="aegis-card-footer border-top bg-light pt-2 pb-2 text-center text-muted small cursor-pointer hover-bg-gray">
              View All Job Roles
            </div>
          </div>
        </div>

        {/* Application Roles Card */}
        <div className="col-md-6 col-xl-4">
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
                {appRoles.map(role => (
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
            <div className="aegis-card-footer border-top bg-light pt-2 pb-2 text-center text-muted small cursor-pointer hover-bg-gray">
              View All App Roles
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

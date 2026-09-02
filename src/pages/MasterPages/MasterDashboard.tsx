import PageHeader from '../../components/Layout/PageHeader';
import { JobRolesCard } from '../../components/Master/JobRolesCard';
import { ApplicationRolesCard } from '../../components/Master/ApplicationRolesCard';

export default function MasterDashboard() {
  return (
    <div className="d-flex flex-column p-4 w-100">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <PageHeader crumbs={['Administrator', 'Master Data']} />
      </div>

      <div className="row g-4">
        {/* Job Roles Card */}
        <div className="col-md-6 col-xl-4">
          <JobRolesCard />
        </div>

        {/* Application Roles Card */}
        <div className="col-md-6 col-xl-4">
          <ApplicationRolesCard />
        </div>
      </div>
    </div>
  );
}

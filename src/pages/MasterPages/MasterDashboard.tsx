import PageHeader from '../../components/Layout/PageHeader';
import { JobRolesCard } from '../../components/Master/JobRolesCard';
import { ApplicationRolesCard } from '../../components/Master/ApplicationRolesCard';
import { ProjectStagesCard } from '../../components/Master/ProjectStagesCard';
import { PageContainer } from '../../components/ui/PageContainer';

export default function MasterDashboard() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={['Administrator', 'Master Data']}
        description="Reference data that powers roles and permissions across Aegis."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <JobRolesCard />
        <ApplicationRolesCard />
        <ProjectStagesCard />
      </div>
    </PageContainer>
  );
}

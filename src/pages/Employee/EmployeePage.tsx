import { Link } from 'react-router-dom';
import PageHeader from '../../components/Layout/PageHeader';
import { EmployeeList } from '../../components/Employee/EmployeeList';
import { Card } from '../../components/ui/Card';
import { buttonVariants } from '../../components/ui/Button';
import { PageContainer } from '../../components/ui/PageContainer';

export default function EmployeePage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={['Administrator', 'Employee']}
        description="Manage your organisation's people and their roles."
        actions={
          <Link to="/employee/manage" className={buttonVariants({ size: 'sm' })}>
            <i className="bi bi-plus-lg" />
            Add Employee
          </Link>
        }
      />

      <Card className="overflow-hidden">
        <EmployeeList />
      </Card>
    </PageContainer>
  );
}

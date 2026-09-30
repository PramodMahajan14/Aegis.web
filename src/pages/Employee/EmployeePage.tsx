import { Link } from 'react-router-dom';
import { EmployeeList } from '../../components/Employee/EmployeeList';
import { buttonVariants } from '../../components/ui/Button';
import { Block, Page, PageBar, PageContent } from '../../components/ui/Page';

export default function EmployeePage() {
  return (
    <Page>
      <PageBar
        title="Employees"
        description="Manage your organisation's people and their roles."
        actions={
          <Link to="/employee/manage" className={buttonVariants({ variant: 'brand', size: 'sm' })}>
            <i className="bi bi-plus-lg" />
            Add employee
          </Link>
        }
      />
      <PageContent>
        <Block className="overflow-visible">
          <EmployeeList />
        </Block>
      </PageContent>
    </Page>
  );
}

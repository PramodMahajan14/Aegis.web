import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { fetchMock } from '../../lib/mockApi';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  dept: string;
  status: 'Active' | 'Away' | 'Offline';
}

const rows: TeamMember[] = [
  { id: 1, name: 'Sarah Miles', role: 'Product Designer', dept: 'Design', status: 'Active' },
  { id: 2, name: 'James Cole', role: 'Backend Engineer', dept: 'Engineering', status: 'Active' },
  { id: 3, name: 'Priya Nair', role: 'Marketing Lead', dept: 'Marketing', status: 'Away' },
  { id: 4, name: 'Diego Alva', role: 'Support Specialist', dept: 'Support', status: 'Active' },
  { id: 5, name: 'Lin Zhao', role: 'Data Analyst', dept: 'Engineering', status: 'Offline' },
];

const statusSeverity: Record<TeamMember['status'], 'success' | 'warning' | 'secondary'> = {
  Active: 'success',
  Away: 'warning',
  Offline: 'secondary',
};

export default function TableNormal() {
  const { data: members = [], isLoading } = useQuery({ queryKey: ['table', 'normal'], queryFn: () => fetchMock(rows) });

  return (
    <>
      <PageHeader title="Normal Tables" crumbs={['Table', 'Normal Tables']} />
      <Card title="Team Members">
        <DataTable value={members} loading={isLoading} size="small" showGridlines={false} stripedRows>
          <Column field="id" header="#" style={{ width: 60 }} />
          <Column field="name" header="Name" body={(r: TeamMember) => <span className="fw-semibold">{r.name}</span>} />
          <Column field="role" header="Role" />
          <Column field="dept" header="Department" />
          <Column
            field="status"
            header="Status"
            body={(r: TeamMember) => <Tag value={r.status} severity={statusSeverity[r.status]} rounded />}
          />
        </DataTable>
      </Card>
    </>
  );
}

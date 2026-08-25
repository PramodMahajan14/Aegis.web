import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { fetchMock } from '../../lib/mockApi';

interface Invoice {
  id: string;
  client: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const invoices: Invoice[] = [
  { id: 'INV-2041', client: 'Nimbus Corp', date: 'Aug 01, 2026', amount: '$4,200', status: 'Paid' },
  { id: 'INV-2042', client: 'Beacon Labs', date: 'Aug 05, 2026', amount: '$1,860', status: 'Pending' },
  { id: 'INV-2043', client: 'Foundry Inc', date: 'Aug 09, 2026', amount: '$7,320', status: 'Paid' },
  { id: 'INV-2044', client: 'Delta Works', date: 'Aug 12, 2026', amount: '$980', status: 'Overdue' },
  { id: 'INV-2045', client: 'Northwind', date: 'Aug 15, 2026', amount: '$3,150', status: 'Paid' },
];

const statusSeverity: Record<Invoice['status'], 'success' | 'warning' | 'danger'> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
};

export default function Invoices() {
  const { data: rows = [], isLoading } = useQuery({ queryKey: ['pages', 'invoices'], queryFn: () => fetchMock(invoices) });

  return (
    <>
      <PageHeader title="Invoices" crumbs={['Pages', 'Invoices']} />
      <Card title="All Invoices" action={<Button label="New Invoice" icon="pi pi-plus" size="small" />}>
        <DataTable value={rows} loading={isLoading} size="small">
          <Column field="id" header="Invoice" body={(r: Invoice) => <span className="fw-semibold">{r.id}</span>} />
          <Column field="client" header="Client" />
          <Column field="date" header="Date" />
          <Column field="amount" header="Amount" />
          <Column
            field="status"
            header="Status"
            body={(r: Invoice) => <Tag value={r.status} severity={statusSeverity[r.status]} rounded />}
          />
          <Column
            header=""
            style={{ width: 60 }}
            body={() => <Button icon="pi pi-download" text rounded severity="secondary" />}
          />
        </DataTable>
      </Card>
    </>
  );
}

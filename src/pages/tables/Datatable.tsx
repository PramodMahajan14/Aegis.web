import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { fetchMock } from '../../lib/mockApi';

interface ClientRow {
  name: string;
  company: string;
  city: string;
  amount: number;
}

const data: ClientRow[] = [
  { name: 'Sarah Miles', company: 'Nimbus Corp', city: 'Austin', amount: 4200 },
  { name: 'James Cole', company: 'Beacon Labs', city: 'Denver', amount: 1860 },
  { name: 'Priya Nair', company: 'Foundry Inc', city: 'Seattle', amount: 7320 },
  { name: 'Diego Alva', company: 'Delta Works', city: 'Miami', amount: 980 },
  { name: 'Lin Zhao', company: 'Northwind', city: 'Chicago', amount: 3150 },
  { name: 'Marcus Lee', company: 'Vertex Labs', city: 'Boston', amount: 2410 },
  { name: 'Alizee Thomas', company: 'Orbit Studio', city: 'Portland', amount: 5600 },
  { name: 'John Doe', company: 'Halcyon LLC', city: 'Phoenix', amount: 1290 },
];

export default function TableDatatable() {
  const [search, setSearch] = useState('');
  const { data: rows = [], isLoading } = useQuery({ queryKey: ['table', 'datatable'], queryFn: () => fetchMock(data) });

  return (
    <>
      <PageHeader title="Jquery Datatables" crumbs={['Table', 'Jquery Datatables']} />
      <Card
        title="Client-side Sortable Table"
        action={
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search..." style={{ width: 200 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          </IconField>
        }
      >
        <DataTable
          value={rows}
          loading={isLoading}
          size="small"
          paginator
          rows={5}
          globalFilterFields={['name', 'company', 'city']}
          globalFilter={search}
          sortField="name"
          sortOrder={1}
          removableSort
          emptyMessage="No matching records"
        >
          <Column field="name" header="Name" sortable body={(r: ClientRow) => <span className="fw-semibold">{r.name}</span>} />
          <Column field="company" header="Company" sortable />
          <Column field="city" header="City" sortable />
          <Column field="amount" header="Amount" sortable body={(r: ClientRow) => '$' + r.amount.toLocaleString()} />
        </DataTable>
      </Card>
    </>
  );
}

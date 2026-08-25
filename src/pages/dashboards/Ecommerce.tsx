import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import { fetchMock } from '../../lib/mockApi';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
}

interface Category {
  label: string;
  pct: number;
}

const orders: Order[] = [
  { id: '#OD1201', customer: 'Sarah Miles', product: 'Wireless Headphones', amount: '$89.00', status: 'Delivered' },
  { id: '#OD1202', customer: 'James Cole', product: '4K Monitor', amount: '$329.00', status: 'Processing' },
  { id: '#OD1203', customer: 'Priya Nair', product: 'Mechanical Keyboard', amount: '$142.00', status: 'Shipped' },
  { id: '#OD1204', customer: 'Diego Alva', product: 'Standing Desk', amount: '$410.00', status: 'Cancelled' },
  { id: '#OD1205', customer: 'Lin Zhao', product: 'USB-C Hub', amount: '$54.00', status: 'Delivered' },
];

const categories: Category[] = [
  { label: 'Electronics', pct: 72 },
  { label: 'Home & Office', pct: 54 },
  { label: 'Accessories', pct: 38 },
  { label: 'Wearables', pct: 26 },
];

const statusSeverity: Record<Order['status'], 'success' | 'warning' | 'info' | 'danger'> = {
  Delivered: 'success',
  Processing: 'warning',
  Shipped: 'info',
  Cancelled: 'danger',
};

const revenueData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 15000, 14000, 18000, 22000, 20000, 26000, 24000],
      borderColor: '#17c9b6',
      backgroundColor: 'rgba(23,201,182,0.15)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export default function Ecommerce() {
  const { data: orderRows = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'ecommerce', 'orders'],
    queryFn: () => fetchMock(orders),
  });
  const { data: categoryRows = [] } = useQuery({
    queryKey: ['dashboard', 'ecommerce', 'categories'],
    queryFn: () => fetchMock(categories),
  });

  return (
    <>
      <PageHeader title="eCommerce" crumbs={['Dashboard', 'eCommerce']} />

      <div className="row g-3">
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Total Orders" value="8,942" delta="+12.4% this month" icon="bi-bag-check" accent="#17c9b6" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Revenue" value="$186,204" delta="+8.1% this month" icon="bi-currency-dollar" accent="#8e6fce" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard label="New Customers" value="1,204" delta="+3.6% this month" icon="bi-person-plus" accent="#3bb6c9" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard label="Refund Rate" value="1.8%" delta="-0.3% this month" icon="bi-arrow-counterclockwise" accent="#f2a154" />
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-8">
          <Card title="Revenue Overview">
            <div style={{ height: 280 }}>
              <Line
                data={revenueData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
          </Card>
        </div>
        <div className="col-lg-4">
          <Card title="Top Categories">
            {categoryRows.map((c) => (
              <div key={c.label} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>{c.label}</span>
                  <span className="text-muted">{c.pct}%</span>
                </div>
                <ProgressBar value={c.pct} showValue={false} style={{ height: 6 }} />
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <Card title="Recent Orders">
            <DataTable value={orderRows} loading={isLoading} size="small" stripedRows>
              <Column field="id" header="Order" body={(r: Order) => <span className="fw-semibold">{r.id}</span>} />
              <Column field="customer" header="Customer" />
              <Column field="product" header="Product" />
              <Column field="amount" header="Amount" />
              <Column
                field="status"
                header="Status"
                body={(r: Order) => <Tag value={r.status} severity={statusSeverity[r.status]} rounded />}
              />
            </DataTable>
          </Card>
        </div>
      </div>
    </>
  );
}

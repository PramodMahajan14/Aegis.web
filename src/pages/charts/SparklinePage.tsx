import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { LineSparkline, BarSparkline } from '../../components/Sparkline';
import { fetchMock } from '../../lib/mockApi';

interface MetricRow {
  name: string;
  value: string;
  trend: number[];
  color: string;
  type: 'line' | 'bar';
}

const rows: MetricRow[] = [
  { name: 'Page Views', value: '128,204', trend: [4, 6, 5, 8, 7, 9, 8, 11, 10], color: '#17c9b6', type: 'line' },
  { name: 'Signups', value: '2,014', trend: [2, 3, 2, 4, 3, 5, 4, 3, 5], color: '#8e6fce', type: 'bar' },
  { name: 'Revenue', value: '$42,908', trend: [7, 5, 8, 6, 9, 7, 10, 8, 12], color: '#f2a154', type: 'line' },
  { name: 'Churned Users', value: '86', trend: [3, 4, 2, 5, 3, 2, 4, 2, 1], color: '#e15b64', type: 'bar' },
];

export default function SparklinePage() {
  const { data: metricRows = [], isLoading } = useQuery({ queryKey: ['chart', 'sparkline'], queryFn: () => fetchMock(rows) });

  return (
    <>
      <PageHeader title="Sparkline Chart" crumbs={['Chart', 'Sparkline Chart']} />
      <Card title="Metrics Overview">
        <DataTable value={metricRows} loading={isLoading} size="small">
          <Column field="name" header="Metric" />
          <Column field="value" header="Value" body={(r: MetricRow) => <span className="fw-semibold">{r.value}</span>} />
          <Column
            header="Trend"
            style={{ width: 160 }}
            body={(r: MetricRow) =>
              r.type === 'line' ? <LineSparkline data={r.trend} color={r.color} /> : <BarSparkline data={r.trend} color={r.color} />
            }
          />
        </DataTable>
      </Card>
    </>
  );
}

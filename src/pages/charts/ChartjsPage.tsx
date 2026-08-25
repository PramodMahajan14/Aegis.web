import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';

const commonOpts: ChartOptions = { responsive: true, maintainAspectRatio: false };

export default function ChartjsPage() {
  return (
    <>
      <PageHeader title="ChartJS" crumbs={['Chart', 'ChartJS']} />
      <div className="row g-3">
        <div className="col-lg-6">
          <Card title="Line Chart">
            <div style={{ height: 260 }}>
              <Line
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    { label: 'This week', data: [12, 19, 14, 22, 18, 26, 24], borderColor: '#17c9b6', backgroundColor: '#17c9b633', fill: true, tension: 0.4 },
                    { label: 'Last week', data: [8, 14, 12, 16, 15, 20, 19], borderColor: '#8e6fce', backgroundColor: '#8e6fce33', fill: true, tension: 0.4 },
                  ],
                }}
                options={commonOpts as ChartOptions<'line'>}
              />
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Bar Chart">
            <div style={{ height: 260 }}>
              <Bar
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{ label: 'Signups', data: [65, 59, 80, 81, 96, 105], backgroundColor: '#3bb6c9' }],
                }}
                options={commonOpts as ChartOptions<'bar'>}
              />
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Doughnut Chart">
            <div style={{ height: 260 }}>
              <Doughnut
                data={{
                  labels: ['Direct', 'Referral', 'Social', 'Organic'],
                  datasets: [{ data: [35, 20, 18, 27], backgroundColor: ['#17c9b6', '#8e6fce', '#f2a154', '#5b8def'] }],
                }}
                options={commonOpts as ChartOptions<'doughnut'>}
              />
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Pie Chart">
            <div style={{ height: 260 }}>
              <Pie
                data={{
                  labels: ['Chrome', 'Safari', 'Firefox', 'Edge'],
                  datasets: [{ data: [52, 24, 14, 10], backgroundColor: ['#17c9b6', '#f2a154', '#8e6fce', '#e15b64'] }],
                }}
                options={commonOpts as ChartOptions<'pie'>}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

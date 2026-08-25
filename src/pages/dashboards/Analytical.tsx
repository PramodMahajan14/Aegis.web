import { useQuery } from '@tanstack/react-query';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { ProgressBar } from 'primereact/progressbar';
import { Avatar } from 'primereact/avatar';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import TrendCard from '../../components/TrendCard';
import { fetchMock } from '../../lib/mockApi';

interface TrendCardData {
  label: string;
  value: string;
  delta: string;
  color: string;
  data: number[];
}

interface Referral {
  label: string;
  value: number;
  pct: number;
  color: string;
}

interface RecentChat {
  name: string;
  msg: string;
}

const trendCards: TrendCardData[] = [
  { label: 'Earnings', value: '$22,500', delta: '19% compared to last week', color: '#f39c56', data: [4, 8, 5, 9, 6, 10, 7, 12, 8] },
  { label: 'Sales', value: '$500', delta: '19% compared to last week', color: '#8e6fce', data: [3, 5, 4, 7, 5, 6, 4, 8, 6] },
  { label: 'Visits', value: '$21,215', delta: '19% compared to last week', color: '#3bb6c9', data: [5, 6, 5, 8, 9, 7, 10, 9, 11] },
  { label: 'Likes', value: '$421,215', delta: '19% compared to last week', color: '#5b8def', data: [6, 4, 7, 5, 9, 6, 8, 10, 9] },
];

const referrals: Referral[] = [
  { label: 'visits from Facebook', value: 2301, pct: 78, color: '#17c9b6' },
  { label: 'visits from Twitter', value: 2107, pct: 62, color: '#8e6fce' },
  { label: 'visits from Search', value: 2308, pct: 84, color: '#f2b134' },
  { label: 'visits from Affiliates', value: 1024, pct: 40, color: '#2ecc71' },
];

const recentChats: RecentChat[] = [
  { name: 'John', msg: 'Hello, What is the update on Project X?' },
  { name: 'Alizee', msg: 'The staging build is ready for review.' },
  { name: 'Marcus', msg: 'Can we push the demo to Friday?' },
];

const topProductsData: ChartData<'bar'> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
  datasets: [
    { label: 'Mobile', backgroundColor: '#3bb6c9', data: [1800, 2600, 2200, 2000, 3600] },
    { label: 'Laptop', backgroundColor: '#f2a154', data: [1200, 2400, 1200, 1600, 2400] },
    { label: 'Computer', backgroundColor: '#8dc63f', data: [1000, 4600, 3900, 4000, 4200] },
  ],
};

const revenueGauge: ChartData<'doughnut'> = {
  labels: ['Achieved', 'Remaining'],
  datasets: [{ data: [63, 37], backgroundColor: ['#23272b', '#eef1f0'], borderWidth: 0 }],
};

const dataManagedTrend: ChartData<'bar'> = {
  labels: Array.from({ length: 20 }, (_, i) => String(i)),
  datasets: [
    {
      data: [4, 6, 3, 8, 5, 9, 2, 7, 6, 4, 8, 5, 3, 9, 6, 4, 7, 5, 8, 6],
      backgroundColor: '#17c9b6',
    },
  ],
};

export default function Analytical() {
  const { data: cards = [] } = useQuery({ queryKey: ['dashboard', 'analytical', 'trend-cards'], queryFn: () => fetchMock(trendCards) });
  const { data: referralData = [] } = useQuery({ queryKey: ['dashboard', 'analytical', 'referrals'], queryFn: () => fetchMock(referrals) });
  const { data: chats = [] } = useQuery({ queryKey: ['dashboard', 'analytical', 'recent-chats'], queryFn: () => fetchMock(recentChats) });

  return (
    <>
      <PageHeader title="Dashboard" crumbs={['Dashboard']} />

      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-sm-6 col-xl-3" key={c.label}>
            <TrendCard {...c} />
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-5">
          <Card title="Top Products">
            <div style={{ height: 260 }}>
              <Bar
                data={topProductsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
                  scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true } },
                } satisfies ChartOptions<'bar'>}
              />
            </div>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card title="Referrals">
            {referralData.map((r) => (
              <div className="mb-3" key={r.label}>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold" style={{ color: 'var(--lucid-text-strong)' }}>
                    {r.value}
                  </span>
                  <span className="text-muted">{r.label}</span>
                </div>
                <ProgressBar value={r.pct} showValue={false} style={{ height: 6 }} color={r.color} />
              </div>
            ))}
          </Card>
        </div>

        <div className="col-lg-3">
          <Card title="Total Revenue">
            <div className="text-center">
              <div className="fw-semibold">Total Sale</div>
              <div className="text-muted small mb-2">2,45,124</div>
              <div style={{ height: 140, position: 'relative' }}>
                <Doughnut
                  data={revenueGauge}
                  options={{
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    maintainAspectRatio: false,
                    cutout: '75%',
                  }}
                />
                <div
                  className="position-absolute top-50 start-50 translate-middle fw-bold fs-4"
                  style={{ color: 'var(--lucid-text-strong)' }}
                >
                  63
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-6">
          <Card title="Recent Chat">
            {chats.map((c) => (
              <div className="d-flex gap-2 mb-3" key={c.name}>
                <Avatar label={c.name[0]} shape="circle" style={{ background: 'var(--lucid-accent)', color: '#fff' }} />
                <div>
                  <div className="fw-semibold small" style={{ color: 'var(--lucid-text-strong)' }}>
                    {c.name}
                  </div>
                  <div className="text-muted small">{c.msg}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Data Managed">
            <div className="fs-3 fw-bold" style={{ color: 'var(--lucid-text-strong)' }}>
              1,523
            </div>
            <div className="text-muted small mb-3">External Records</div>
            <div style={{ height: 90 }}>
              <Bar
                data={dataManagedTrend}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

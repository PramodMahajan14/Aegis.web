import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { fetchMock } from '../../lib/mockApi';

interface Stat {
  label: string;
  value: string;
  delta: string;
  icon: string;
  accent: string;
}

const stats: Stat[] = [
  { label: 'Total Users', value: '48,204', delta: '+4.2% this week', icon: 'bi-people', accent: '#17c9b6' },
  { label: 'Active Sessions', value: '2,014', delta: '+1.1% this week', icon: 'bi-broadcast', accent: '#8e6fce' },
  { label: 'Bounce Rate', value: '32.4%', delta: '-0.8% this week', icon: 'bi-arrow-down-right', accent: '#f2a154' },
  { label: 'Avg. Session', value: '4m 12s', delta: '+0.4% this week', icon: 'bi-clock-history', accent: '#3bb6c9' },
  { label: 'Conversions', value: '1,204', delta: '+2.6% this week', icon: 'bi-graph-up-arrow', accent: '#2ecc71' },
  { label: 'Support Tickets', value: '86', delta: '-5.1% this week', icon: 'bi-life-preserver', accent: '#e15b64' },
  { label: 'Churn Rate', value: '1.4%', delta: '-0.2% this week', icon: 'bi-person-dash', accent: '#5b8def' },
  { label: 'MRR', value: '$92,410', delta: '+6.3% this week', icon: 'bi-cash-coin', accent: '#f2b134' },
];

export default function Statistics() {
  const { data: statRows = [] } = useQuery({ queryKey: ['widgets', 'statistics'], queryFn: () => fetchMock(stats) });

  return (
    <>
      <PageHeader title="Statistics" crumbs={['Widgets', 'Statistics']} />
      <div className="row g-3">
        {statRows.map((s) => (
          <div className="col-sm-6 col-xl-3" key={s.label}>
            <StatCard {...s} />
          </div>
        ))}
      </div>
    </>
  );
}

import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface TrendCardProps {
  label: string;
  value: string;
  delta?: string;
  color: string;
  data: number[];
}

export default function TrendCard({ label, value, delta, color, data }: TrendCardProps) {
  const chartData: ChartData<'line'> = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: color + '33',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: { line: { borderJoinStyle: 'round' } },
  };

  return (
    <div className="lucid-card h-100">
      <div className="lucid-card-body pb-0">
        <div className="stat-label">{label}</div>
        <div className="stat-value mt-1">{value}</div>
        {delta && <div className="stat-delta mt-1 mb-2">{delta}</div>}
      </div>
      <div style={{ height: 60 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

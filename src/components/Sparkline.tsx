import { Line, Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

const baseOptions: ChartOptions<'line' | 'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  elements: { point: { radius: 0 } },
};

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function LineSparkline({ data, color = '#17c9b6', height = 40 }: SparklineProps) {
  return (
    <div style={{ height }}>
      <Line
        data={{ labels: data.map((_, i) => i), datasets: [{ data, borderColor: color, borderWidth: 2, fill: false }] }}
        options={baseOptions as ChartOptions<'line'>}
      />
    </div>
  );
}

export function BarSparkline({ data, color = '#17c9b6', height = 40 }: SparklineProps) {
  return (
    <div style={{ height }}>
      <Bar
        data={{ labels: data.map((_, i) => i), datasets: [{ data, backgroundColor: color }] }}
        options={baseOptions as ChartOptions<'bar'>}
      />
    </div>
  );
}

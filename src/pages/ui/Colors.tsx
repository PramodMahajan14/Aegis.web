import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { fetchMock } from '../../lib/mockApi';

interface ColorSwatch {
  name: string;
  hex: string;
}

const colors: ColorSwatch[] = [
  { name: 'Accent', hex: '#17c9b6' },
  { name: 'Primary', hex: '#007bff' },
  { name: 'Success', hex: '#28a745' },
  { name: 'Danger', hex: '#dc3545' },
  { name: 'Warning', hex: '#ffc107' },
  { name: 'Info', hex: '#17a2b8' },
  { name: 'Purple', hex: '#8e6fce' },
  { name: 'Orange', hex: '#f2a154' },
  { name: 'Dark', hex: '#23272b' },
  { name: 'Light', hex: '#f4f7f6' },
];

export default function Colors() {
  const { data: palette = [] } = useQuery({ queryKey: ['ui', 'colors'], queryFn: () => fetchMock(colors) });

  return (
    <>
      <PageHeader title="Colors" crumbs={['UI Elements', 'Colors']} />
      <Card title="Palette">
        <div className="row g-3">
          {palette.map((c) => (
            <div className="col-6 col-md-3 col-xl-2" key={c.name}>
              <div className="rounded-3" style={{ height: 80, background: c.hex }} />
              <div className="mt-2 small fw-semibold" style={{ color: 'var(--lucid-text-strong)' }}>
                {c.name}
              </div>
              <div className="text-muted small">{c.hex}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

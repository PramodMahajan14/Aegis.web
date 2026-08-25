import { useQuery } from '@tanstack/react-query';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import PageHeader from '../../components/PageHeader';
import { fetchMock } from '../../lib/mockApi';

interface TaskCard {
  title: string;
  tag: string;
}

interface Column {
  label: string;
  color: string;
  cards: TaskCard[];
}

const columns: Column[] = [
  {
    label: 'Backlog',
    color: '#9aa5a3',
    cards: [
      { title: 'Audit onboarding flow', tag: 'UX' },
      { title: 'Evaluate analytics vendors', tag: 'Research' },
    ],
  },
  {
    label: 'In Progress',
    color: '#3bb6c9',
    cards: [
      { title: 'Build notifications service', tag: 'Backend' },
      { title: 'Redesign settings page', tag: 'UI' },
      { title: 'Migrate auth to OAuth2', tag: 'Backend' },
    ],
  },
  {
    label: 'Review',
    color: '#f2a154',
    cards: [{ title: 'API rate limiting', tag: 'Backend' }],
  },
  {
    label: 'Done',
    color: '#2ecc71',
    cards: [
      { title: 'Set up CI pipeline', tag: 'DevOps' },
      { title: 'Landing page copy', tag: 'Marketing' },
    ],
  },
];

export default function Taskboard() {
  const { data: board = [] } = useQuery({ queryKey: ['app', 'taskboard'], queryFn: () => fetchMock(columns) });

  return (
    <>
      <PageHeader title="Taskboard" crumbs={['App', 'Taskboard']} />
      <div className="row g-3 flex-nowrap" style={{ overflowX: 'auto' }}>
        {board.map((col) => (
          <div className="col-10 col-sm-6 col-lg-3" key={col.label} style={{ minWidth: 260 }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold" style={{ color: 'var(--lucid-text-strong)' }}>
                <span
                  className="d-inline-block rounded-circle me-2"
                  style={{ width: 8, height: 8, background: col.color }}
                />
                {col.label}
              </span>
              <Badge value={col.cards.length} severity="secondary" />
            </div>
            <div className="d-flex flex-column gap-2">
              {col.cards.map((card) => (
                <div className="lucid-card" key={card.title}>
                  <div className="lucid-card-body py-2 px-3">
                    <div className="small mb-2">{card.title}</div>
                    <Tag value={card.tag} severity="secondary" />
                  </div>
                </div>
              ))}
              <Button label="Add card" icon="pi pi-plus" text className="text-muted" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

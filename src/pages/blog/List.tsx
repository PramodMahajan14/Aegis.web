import { useQuery } from '@tanstack/react-query';
import { Tag } from 'primereact/tag';
import PageHeader from '../../components/PageHeader';
import { fetchMock } from '../../lib/mockApi';

interface Post {
  title: string;
  author: string;
  date: string;
  tag: string;
  color: string;
}

const posts: Post[] = [
  { title: 'Designing dashboards people actually enjoy using', author: 'Alizee Thomas', date: 'Aug 12, 2026', tag: 'Design', color: '#17c9b6' },
  { title: 'A practical guide to component-driven React apps', author: 'Marcus Lee', date: 'Aug 08, 2026', tag: 'Engineering', color: '#8e6fce' },
  { title: 'What we learned migrating to a new auth stack', author: 'Priya Nair', date: 'Jul 30, 2026', tag: 'Engineering', color: '#3bb6c9' },
  { title: 'Onboarding metrics that actually move the needle', author: 'Diego Alva', date: 'Jul 21, 2026', tag: 'Product', color: '#f2a154' },
  { title: 'Building an admin theme system with CSS variables', author: 'Alizee Thomas', date: 'Jul 14, 2026', tag: 'Design', color: '#17c9b6' },
  { title: 'Notes from our Q3 planning offsite', author: 'James Cole', date: 'Jul 02, 2026', tag: 'Culture', color: '#5b8def' },
];

export default function BlogList() {
  const { data: postRows = [] } = useQuery({ queryKey: ['blog', 'list'], queryFn: () => fetchMock(posts) });

  return (
    <>
      <PageHeader title="Blog List" crumbs={['Blog', 'Blog List']} />
      <div className="row g-3">
        {postRows.map((p) => (
          <div className="col-md-6 col-xl-4" key={p.title}>
            <div className="lucid-card h-100">
              <div style={{ height: 140, background: p.color + '22' }} className="d-flex align-items-center justify-content-center rounded-top">
                <i className="bi bi-image fs-1" style={{ color: p.color }} />
              </div>
              <div className="lucid-card-body">
                <Tag value={p.tag} style={{ background: p.color + '22', color: p.color }} className="mb-2" />
                <h6 className="fw-semibold" style={{ color: 'var(--lucid-text-strong)' }}>
                  {p.title}
                </h6>
                <div className="text-muted small">
                  {p.author} &middot; {p.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

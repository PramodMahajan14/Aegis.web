import PageHeader from './PageHeader';
import Card from './Card';

interface StubPageProps {
  title: string;
  crumbs?: string[];
  icon?: string;
  note?: string;
}

export default function StubPage({ title, crumbs, icon = 'bi-cone-striped', note }: StubPageProps) {
  return (
    <>
      <PageHeader title={title} crumbs={crumbs} />
      <Card className="stub-page">
        <div className="lucid-card-body text-center py-5">
          <div className="placeholder-icon mb-3">
            <i className={'bi ' + icon} />
          </div>
          <h5 className="mb-2" style={{ color: 'var(--lucid-text-strong)' }}>
            {title}
          </h5>
          <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 420 }}>
            {note ||
              'This page is scaffolded and wired into navigation, ready for its content to be built out next.'}
          </p>
        </div>
      </Card>
    </>
  );
}

import { Breadcrumbs, type BreadcrumbProps } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  crumbs?: string[];
}

export default function PageHeader({ crumbs = [] }: PageHeaderProps) {
  const navigate = useNavigate();

  const items: BreadcrumbProps[] = [
    { icon: 'home', onClick: () => navigate('/') },
    ...crumbs.map((c) => ({ text: c })),
  ];

  return (
    <div className="page-header">
      <Breadcrumbs items={items} />
    </div>
  );
}

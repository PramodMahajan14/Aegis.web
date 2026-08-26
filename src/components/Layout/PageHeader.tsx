import { Breadcrumbs, type BreadcrumbProps } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  crumbs?: string[];
}

export default function PageHeader({ title, crumbs = [] }: PageHeaderProps) {
  const navigate = useNavigate();

  const items: BreadcrumbProps[] = [
    { icon: 'home', onClick: () => navigate('/') },
    ...crumbs.map((c) => ({ text: c })),
  ];

  return (
    <div className="page-header">
      <div className='d-flex flex-column gap-2'>
        <h6>{title}</h6>
        <Breadcrumbs items={items} />
      </div>
    </div>
  );
}

import { BreadCrumb } from 'primereact/breadcrumb';
import type { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  crumbs?: string[];
}

export default function PageHeader({ title, crumbs = [] }: PageHeaderProps) {
  const navigate = useNavigate();

  const items: MenuItem[] = crumbs.map((c) => ({ label: c }));
  const home: MenuItem = { icon: 'pi pi-home', command: () => navigate('/') };

  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <BreadCrumb model={items} home={home} />
      </div>
    </div>
  );
}

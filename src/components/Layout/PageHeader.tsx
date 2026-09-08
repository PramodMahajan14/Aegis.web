import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  crumbs?: string[];
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ crumbs = [], title, description, actions }: PageHeaderProps) {
  const heading = title ?? crumbs[crumbs.length - 1] ?? 'Dashboard';

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <nav className="flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            <i className="bi bi-house-door" />
          </Link>
          {crumbs.map((c, i) => (
            <span key={c + i} className="flex items-center gap-1.5">
              <i className="bi bi-chevron-right text-[0.65rem] opacity-60" />
              <span className={i === crumbs.length - 1 ? 'font-medium text-foreground' : ''}>{c}</span>
            </span>
          ))}
        </nav>
        <h1 className="mt-1.5 text-[1.4rem] font-semibold tracking-tight text-foreground">
          {heading}
        </h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

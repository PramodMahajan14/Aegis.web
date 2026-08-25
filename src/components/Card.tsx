import type { ReactNode } from 'react';
import { Card as PrimeCard } from 'primereact/card';

interface CardProps {
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Card({ title, action, children, className = '', bodyClassName = '' }: CardProps) {
  const header = title ? (
    <div className="lucid-card-header">
      <h6>{title}</h6>
      {action}
    </div>
  ) : undefined;

  return (
    <PrimeCard className={'lucid-card ' + className} header={header}>
      <div className={'lucid-card-body ' + bodyClassName}>{children}</div>
    </PrimeCard>
  );
}

import React from 'react';

export interface AvatarProps {
  name: string;
  imageUrl?: string;
  jobRole?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  hideDetails?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  imageUrl, 
  jobRole, 
  email,
  size = 'md',
  hideDetails = false
}) => {
  const initials = name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  const sizeMap = {
    sm: '32px',
    md: '40px',
    lg: '56px'
  };

  const dimension = sizeMap[size];
  const subtitle = jobRole || email;

  return (
    <div className="d-flex align-items-center py-1">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          className="rounded-circle me-3 object-fit-cover"
          style={{ width: dimension, height: dimension, flexShrink: 0 }}
        />
      ) : (
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle me-3 fw-bold text-primary" 
          style={{ width: dimension, height: dimension, backgroundColor: 'var(--aegis-accent-light)', flexShrink: 0 }}
        >
          {initials}
        </div>
      )}
      
      {!hideDetails && (
        <div>
          <div className="fw-semibold text-strong" style={{ marginBottom: subtitle ? '2px' : '0' }}>{name}</div>
          {subtitle && <div className="small text-muted" style={{ fontSize: '0.8rem' }}>{subtitle}</div>}
        </div>
      )}
    </div>
  );
};

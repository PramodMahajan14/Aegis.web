interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon?: string;
  accent?: string;
}

export default function StatCard({ label, value, delta, icon, accent = 'var(--lucid-accent)' }: StatCardProps) {
  return (
    <div className="lucid-card stat-card h-100">
      <div className="lucid-card-body d-flex align-items-start justify-content-between">
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value mt-1">{value}</div>
          {delta && <div className="stat-delta mt-1">{delta}</div>}
        </div>
        {icon && (
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 44, height: 44, background: accent + '22', color: accent }}
          >
            <i className={'bi ' + icon + ' fs-5'} />
          </div>
        )}
      </div>
    </div>
  );
}

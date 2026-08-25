import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import PageHeader from '../../components/PageHeader';
import { fetchMock } from '../../lib/mockApi';

interface Plan {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
}

const plans: Plan[] = [
  { name: 'Starter', price: '$9', features: ['1 project', '5 GB storage', 'Email support'] },
  { name: 'Growth', price: '$29', features: ['10 projects', '50 GB storage', 'Priority support', 'Team roles'], featured: true },
  { name: 'Scale', price: '$79', features: ['Unlimited projects', '500 GB storage', 'Dedicated support', 'SSO & audit logs'] },
];

export default function Pricing() {
  const { data: planRows = [] } = useQuery({ queryKey: ['pages', 'pricing'], queryFn: () => fetchMock(plans) });

  return (
    <>
      <PageHeader title="Pricing" crumbs={['Pages', 'Pricing']} />
      <div className="row g-3">
        {planRows.map((p) => (
          <div className="col-md-4" key={p.name}>
            <div
              className="lucid-card h-100"
              style={p.featured ? { borderColor: 'var(--lucid-accent)', borderWidth: 2 } : undefined}
            >
              <div className="lucid-card-body text-center">
                {p.featured && <Tag value="Most Popular" className="mb-2" />}
                <h6 className="fw-semibold">{p.name}</h6>
                <div className="fs-2 fw-bold" style={{ color: 'var(--lucid-text-strong)' }}>
                  {p.price}
                  <span className="fs-6 text-muted fw-normal">/mo</span>
                </div>
                <ul className="list-unstyled text-start mt-3 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="mb-2 small">
                      <i className="bi bi-check2 text-accent me-2" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button label={'Choose ' + p.name} className="w-100" outlined={!p.featured} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

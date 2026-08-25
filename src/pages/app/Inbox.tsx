import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Badge } from 'primereact/badge';
import PageHeader from '../../components/PageHeader';
import { fetchMock } from '../../lib/mockApi';

interface Folder {
  label: string;
  icon: string;
  count?: number;
}

interface Email {
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

const folders: Folder[] = [
  { label: 'Inbox', icon: 'bi-inbox', count: 12 },
  { label: 'Sent', icon: 'bi-send' },
  { label: 'Drafts', icon: 'bi-file-earmark' },
  { label: 'Starred', icon: 'bi-star' },
  { label: 'Trash', icon: 'bi-trash' },
];

const emails: Email[] = [
  { from: 'Sarah Miles', subject: 'Q3 marketing budget review', preview: 'Attached is the revised budget sheet for your review before...', time: '09:14', unread: true },
  { from: 'GitHub', subject: '[Aegis.web] Build passed on main', preview: 'Your latest commit passed all checks and is ready to deploy.', time: '08:52', unread: true },
  { from: 'James Cole', subject: 'Re: Contract renewal', preview: "Sounds good, let's schedule a call for Thursday afternoon.", time: 'Yesterday', unread: false },
  { from: 'Priya Nair', subject: 'Design review feedback', preview: 'Left a few comments on the Figma file, mostly around spacing.', time: 'Yesterday', unread: false },
  { from: 'Billing', subject: 'Your invoice #4021 is ready', preview: 'Your monthly invoice has been generated and is available now.', time: 'Mon', unread: false },
];

export default function Inbox() {
  const [active, setActive] = useState(0);
  const { data: emailRows = [] } = useQuery({ queryKey: ['app', 'inbox', 'emails'], queryFn: () => fetchMock(emails) });

  return (
    <>
      <PageHeader title="Inbox" crumbs={['App', 'Inbox']} />
      <div className="lucid-card">
        <div className="row g-0">
          <div className="col-md-3 border-end">
            <div className="p-3">
              <Button label="Compose" icon="pi pi-pencil" className="w-100 mb-3" />
              <ul className="list-unstyled">
                {folders.map((f, i) => (
                  <li key={f.label}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="d-flex align-items-center justify-content-between px-2 py-2 rounded text-decoration-none text-body"
                      style={{ background: i === 0 ? 'var(--lucid-bg)' : 'transparent' }}
                    >
                      <span>
                        <i className={'bi ' + f.icon + ' me-2 text-accent'} />
                        {f.label}
                      </span>
                      {f.count && <Badge value={f.count} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-9">
            <ul className="list-unstyled mb-0">
              {emailRows.map((e, i) => (
                <li
                  key={i}
                  onClick={() => setActive(i)}
                  className="d-flex gap-3 px-3 py-3 border-bottom"
                  style={{ cursor: 'pointer', background: active === i ? 'var(--lucid-bg)' : 'transparent' }}
                >
                  <Checkbox checked={false} onChange={() => {}} onClick={(ev) => ev.stopPropagation()} />
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex justify-content-between">
                      <span className={e.unread ? 'fw-bold' : 'fw-semibold'} style={{ color: 'var(--lucid-text-strong)' }}>
                        {e.from}
                      </span>
                      <span className="text-muted small flex-shrink-0 ms-2">{e.time}</span>
                    </div>
                    <div className={e.unread ? 'fw-semibold small' : 'small'}>{e.subject}</div>
                    <div className="text-muted small text-truncate">{e.preview}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import PageHeader from '../../components/PageHeader';
import { fetchMock } from '../../lib/mockApi';

interface Contact {
  name: string;
  last: string;
  online: boolean;
}

interface ChatMessage {
  me: boolean;
  text: string;
}

const contacts: Contact[] = [
  { name: 'John Doe', last: 'What is the update on Project X?', online: true },
  { name: 'Alizee Thomas', last: 'Sounds great, see you then!', online: true },
  { name: 'Marcus Lee', last: 'Can we push the demo to Friday?', online: false },
  { name: 'Priya Nair', last: 'Thanks for the review!', online: true },
  { name: 'Diego Alva', last: 'Sent the files over.', online: false },
];

const initialThread: ChatMessage[] = [
  { me: false, text: 'Hello, John' },
  { me: false, text: 'What is the update on Project X?' },
  { me: true, text: 'Hey! We just wrapped QA, deploying to staging today.' },
  { me: true, text: "I'll send the build link shortly." },
];

export default function Chat() {
  const [active, setActive] = useState(0);
  const [thread, setThread] = useState<ChatMessage[]>(initialThread);
  const [draft, setDraft] = useState('');
  const { data: contactRows = [] } = useQuery({ queryKey: ['app', 'chat', 'contacts'], queryFn: () => fetchMock(contacts) });

  function send() {
    if (!draft.trim()) return;
    setThread((t) => [...t, { me: true, text: draft.trim() }]);
    setDraft('');
  }

  const activeContact = contactRows[active];

  return (
    <>
      <PageHeader title="Chat" crumbs={['App', 'Chat']} />
      <div className="lucid-card">
        <div className="row g-0" style={{ minHeight: 520 }}>
          <div className="col-md-4 border-end">
            <div className="p-3 border-bottom">
              <InputText className="w-100" placeholder="Search contacts..." />
            </div>
            <ul className="list-unstyled mb-0">
              {contactRows.map((c, i) => (
                <li
                  key={c.name}
                  onClick={() => setActive(i)}
                  className="d-flex align-items-center gap-2 px-3 py-2"
                  style={{ cursor: 'pointer', background: active === i ? 'var(--lucid-bg)' : 'transparent' }}
                >
                  <span className="position-relative">
                    <Avatar label={c.name[0]} shape="circle" style={{ background: 'var(--lucid-accent)', color: '#fff' }} />
                    {c.online && (
                      <span
                        className="position-absolute bottom-0 end-0 rounded-circle bg-success border border-2 border-white"
                        style={{ width: 10, height: 10 }}
                      />
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-semibold small text-truncate" style={{ color: 'var(--lucid-text-strong)' }}>
                      {c.name}
                    </div>
                    <div className="text-muted small text-truncate">{c.last}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-8 d-flex flex-column">
            <div className="px-3 py-3 border-bottom fw-semibold" style={{ color: 'var(--lucid-text-strong)' }}>
              {activeContact?.name}
            </div>
            <div className="flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
              {thread.map((m, i) => (
                <div key={i} className={'d-flex mb-2 ' + (m.me ? 'justify-content-end' : 'justify-content-start')}>
                  <div
                    className="px-3 py-2 rounded-3"
                    style={{
                      maxWidth: '70%',
                      background: m.me ? 'var(--lucid-accent)' : 'var(--lucid-bg)',
                      color: m.me ? '#fff' : 'var(--lucid-text)',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-top d-flex gap-2">
              <InputText
                className="w-100"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <Button icon="pi pi-send" onClick={send} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionTab } from 'primereact/accordion';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { fetchMock } from '../../lib/mockApi';

interface FaqEntry {
  q: string;
  a: string;
}

const faqs: FaqEntry[] = [
  { q: 'How do I invite team members?', a: "Go to Settings > Team and send an invite by email. They'll get access once they accept." },
  { q: 'Can I export my data?', a: 'Yes, every table and report can be exported to CSV or PDF from its action menu.' },
  { q: 'Is there an API?', a: 'A REST API is available on the Growth plan and above, with full docs in the developer portal.' },
  { q: 'How is billing calculated?', a: 'Billing is per active seat, prorated for mid-cycle changes and billed monthly or annually.' },
];

export default function Faq() {
  const { data: faqRows = [] } = useQuery({ queryKey: ['pages', 'faq'], queryFn: () => fetchMock(faqs) });

  return (
    <>
      <PageHeader title="FAQ" crumbs={['Pages', 'FAQ']} />
      <Card title="Frequently Asked Questions">
        <Accordion activeIndex={0}>
          {faqRows.map((f) => (
            <AccordionTab key={f.q} header={f.q}>
              <p className="text-muted small m-0">{f.a}</p>
            </AccordionTab>
          ))}
        </Accordion>
      </Card>
    </>
  );
}

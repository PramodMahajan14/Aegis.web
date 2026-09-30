import { useParams } from 'react-router-dom';
import { ManageEmployee } from '../../components/Employee/ManageEmployee';
import { Block, Page, PageBar, PageContent } from '../../components/ui/Page';

const tips = [
  {
    icon: 'bi-check2-circle',
    title: 'Accurate details',
    body: 'Ensure all legal names and contact information match official identification documents exactly.',
  },
  {
    icon: 'bi-key',
    title: 'Role assignments',
    body: 'The Job Role drives system permissions and access scopes across the entire platform.',
  },
  {
    icon: 'bi-lock',
    title: 'Data privacy',
    body: 'All employee data is encrypted and access is restricted to authorized personnel.',
  },
];

export default function ManageEmployeePage() {
  const { id } = useParams();
  return (
    <Page>
      <PageBar
        back={{ to: '/employee', label: 'Employees' }}
        title={id ? 'Edit employee' : 'Add employee'}
        description="Provide complete details for the employee profile."
      />

      <PageContent>
        <Block className="grid lg:grid-cols-[1fr_320px]">
          <div className="px-5 py-5 sm:px-8 sm:py-6">
            <div className="max-w-3xl">
              <ManageEmployee />
            </div>
          </div>

          <aside className="hidden border-l border-border px-6 py-6 lg:block">
            <h2 className="flex items-center gap-2 text-[0.8125rem] font-semibold tracking-normal">
              <i className="bi bi-lightbulb text-brand" /> Tips
            </h2>
            <ul className="mt-4 space-y-5">
              {tips.map((t) => (
                <li key={t.title} className="flex gap-3">
                  <i className={`bi ${t.icon} mt-0.5 text-muted-foreground`} />
                  <div>
                    <div className="text-[0.8125rem] font-medium text-foreground">{t.title}</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              <i className="bi bi-question-circle mr-1" />
              Need help? Check the documentation or contact IT support.
            </div>
          </aside>
        </Block>
      </PageContent>
    </Page>
  );
}

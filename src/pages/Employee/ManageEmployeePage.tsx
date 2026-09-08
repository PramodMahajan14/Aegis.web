import PageHeader from '../../components/Layout/PageHeader';
import { ManageEmployee } from '../../components/Employee/ManageEmployee';
import { Card } from '../../components/ui/Card';
import { PageContainer } from '../../components/ui/PageContainer';

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
  return (
    <PageContainer>
      <PageHeader crumbs={['Administrator', 'Employee', 'Manage']} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand-stronger">
              <i className="bi bi-person-plus text-lg" />
            </span>
            <div>
              <h3 className="text-[0.9375rem] font-semibold">Employee information</h3>
              <p className="text-[0.8125rem] text-muted-foreground">
                Provide complete details for the employee profile.
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <ManageEmployee />
          </div>
        </Card>

        <div className="hidden lg:block">
          <div className="relative h-full overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground">
            <i className="bi bi-shield-shaded pointer-events-none absolute -right-8 -top-8 text-[10rem] opacity-10" />
            <div className="relative flex items-center gap-3 border-b border-white/20 pb-4">
              <span className="grid size-9 place-items-center rounded-full bg-white/20">
                <i className="bi bi-lightbulb" />
              </span>
              <h3 className="text-base font-semibold text-primary-foreground">Smart tips</h3>
            </div>

            <ul className="relative mt-5 space-y-5">
              {tips.map((t) => (
                <li key={t.title} className="flex gap-3">
                  <i className={`bi ${t.icon} mt-0.5 opacity-80`} />
                  <div>
                    <div className="text-sm font-semibold">{t.title}</div>
                    <p className="mt-0.5 text-[0.8125rem] leading-relaxed opacity-80">{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mt-6 rounded-lg border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
              <i className="bi bi-question-circle mb-1 block text-lg" />
              <div className="text-sm font-semibold">Need help?</div>
              <p className="mt-0.5 text-[0.8125rem] opacity-80">
                Check the documentation or contact IT support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

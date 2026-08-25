import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { basicFormSchema, type BasicFormValues } from '../../schemas/forms';

const departments = ['Design', 'Engineering', 'Marketing'];

export default function FormsBasic() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicFormValues>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
      department: 'Design',
      emailNotifications: true,
      smsNotifications: false,
      billingPlan: 'monthly',
      twoFactor: true,
    },
  });

  async function onSubmit(values: BasicFormValues) {
    await new Promise((r) => setTimeout(r, 300));
    console.log('basic form', values);
  }

  return (
    <>
      <PageHeader title="Basic Elements" crumbs={['Forms', 'Basic Elements']} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row g-3">
          <div className="col-lg-6">
            <Card title="Text Inputs">
              <div className="mb-3">
                <label className="form-label small">Full Name</label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <InputText {...field} placeholder="Jane Cooper" className={'w-100' + (errors.fullName ? ' p-invalid' : '')} />
                  )}
                />
                {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName.message}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label small">Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      type="email"
                      placeholder="jane@company.com"
                      className={'w-100' + (errors.email ? ' p-invalid' : '')}
                    />
                  )}
                />
                {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label small">Disabled</label>
                <InputText disabled placeholder="Disabled input" className="w-100" />
              </div>
              <label className="form-label small">Message</label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <InputTextarea {...field} rows={3} placeholder="Write something..." className="w-100" />
                )}
              />
            </Card>
          </div>
          <div className="col-lg-6">
            <Card title="Selections">
              <div className="mb-3">
                <label className="form-label small">Select</label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={departments}
                      className="w-100"
                    />
                  )}
                />
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Controller
                    name="emailNotifications"
                    control={control}
                    render={({ field }) => (
                      <Checkbox inputId="c1" checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                    )}
                  />
                  <label htmlFor="c1" className="small">
                    Email notifications
                  </label>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Controller
                    name="smsNotifications"
                    control={control}
                    render={({ field }) => (
                      <Checkbox inputId="c2" checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                    )}
                  />
                  <label htmlFor="c2" className="small">
                    SMS notifications
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <Controller
                  name="billingPlan"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <RadioButton
                          inputId="r1"
                          value="monthly"
                          checked={field.value === 'monthly'}
                          onChange={(e) => field.onChange(e.value)}
                        />
                        <label htmlFor="r1" className="small">
                          Monthly billing
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <RadioButton
                          inputId="r2"
                          value="annual"
                          checked={field.value === 'annual'}
                          onChange={(e) => field.onChange(e.value)}
                        />
                        <label htmlFor="r2" className="small">
                          Annual billing
                        </label>
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <Controller
                  name="twoFactor"
                  control={control}
                  render={({ field }) => <InputSwitch checked={!!field.value} onChange={(e) => field.onChange(e.value)} />}
                />
                <label className="small">Enable two-factor auth</label>
              </div>
            </Card>
          </div>
          <div className="col-12">
            <Button type="submit" label="Save changes" loading={isSubmitting} />
          </div>
        </div>
      </form>
    </>
  );
}

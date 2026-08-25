import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { validationFormSchema, type ValidationFormValues } from '../../schemas/forms';

export default function FormsValidation() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ValidationFormValues>({
    resolver: zodResolver(validationFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', agree: false },
  });

  async function onSubmit(values: ValidationFormValues) {
    await new Promise((r) => setTimeout(r, 300));
    console.log('validated form', values);
  }

  return (
    <>
      <PageHeader title="Form Validation" crumbs={['Forms', 'Form Validation']} />
      <Card title="Zod + React Hook Form Validation">
        {isSubmitSuccessful && (
          <Message severity="success" text="Form submitted successfully." className="w-100 mb-3" onClick={() => reset()} />
        )}
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">First name</label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <InputText {...field} className={'w-100' + (errors.firstName ? ' p-invalid' : '')} />
                )}
              />
              {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName.message}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label small">Last name</label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <InputText {...field} className={'w-100' + (errors.lastName ? ' p-invalid' : '')} />
                )}
              />
              {errors.lastName && <div className="invalid-feedback d-block">{errors.lastName.message}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label small">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputText {...field} type="email" className={'w-100' + (errors.email ? ' p-invalid' : '')} />
                )}
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label small">Phone</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputText {...field} type="tel" placeholder="10 digits" className={'w-100' + (errors.phone ? ' p-invalid' : '')} />
                )}
              />
              {errors.phone && <div className="invalid-feedback d-block">{errors.phone.message}</div>}
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center gap-2">
                <Controller
                  name="agree"
                  control={control}
                  render={({ field }) => (
                    <Checkbox inputId="agree" checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
                  )}
                />
                <label htmlFor="agree" className="small">
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.agree && <div className="invalid-feedback d-block">{errors.agree.message}</div>}
            </div>
            <div className="col-12">
              <Button type="submit" label="Submit form" loading={isSubmitting} />
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}

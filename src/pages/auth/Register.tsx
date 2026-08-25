import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { registerSchema, type RegisterFormValues } from '../../schemas/auth';

export default function Register() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', terms: false },
  });

  async function onSubmit(values: RegisterFormValues) {
    await new Promise((r) => setTimeout(r, 400));
    console.log('register', values);
    navigate('/pages/login');
  }

  return (
    <div className="auth-card">
      <div className="text-center mb-4">
        <i className="bi bi-triangle-fill text-accent fs-2" />
        <h4 className="fw-bold mt-2" style={{ color: 'var(--lucid-text-strong)' }}>
          Create Account
        </h4>
        <p className="text-muted small mb-0">Start your free trial, no card required</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
        <div className="mb-3">
          <label className="form-label small">Full Name</label>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                placeholder="Alizee Thomas"
                autoComplete="off"
                className={'w-100' + (errors.fullName ? ' p-invalid' : '')}
              />
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
                placeholder="you@company.com"
                autoComplete="off"
                className={'w-100' + (errors.email ? ' p-invalid' : '')}
              />
            )}
          />
          {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label small">Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                inputClassName="w-100"
                className={errors.password ? 'p-invalid' : ''}
                placeholder="********"
                toggleMask
              />
            )}
          />
          {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
        </div>
        <div className="mb-3 d-flex align-items-center gap-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox inputId="terms" checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
            )}
          />
          <label htmlFor="terms" className="small">
            I agree to the Terms &amp; Privacy Policy
          </label>
        </div>
        {errors.terms && <div className="invalid-feedback d-block mb-3">{errors.terms.message}</div>}
        <Button type="submit" label="Create Account" loading={isSubmitting} className="w-100 mb-3" />
        <p className="text-center small text-muted mb-0">
          Already have an account?{' '}
          <Link to="/pages/login" className="text-accent text-decoration-none">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

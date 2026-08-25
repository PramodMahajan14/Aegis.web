import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { loginSchema, type LoginFormValues } from '../../schemas/auth';

export default function Login() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  async function onSubmit(values: LoginFormValues) {
    await new Promise((r) => setTimeout(r, 400));
    console.log('login', values);
    navigate('/');
  }

  return (
    <div className="auth-card">
      <div className="text-center mb-4">
        <i className="bi bi-triangle-fill text-accent fs-2" />
        <h4 className="fw-bold mt-2" style={{ color: 'var(--lucid-text-strong)' }}>
          LUCID
        </h4>
        <p className="text-muted small mb-0">Sign in to continue to your dashboard</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
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
                feedback={false}
                toggleMask
              />
            )}
          />
          {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox inputId="remember" checked={!!field.value} onChange={(e) => field.onChange(e.checked)} />
              )}
            />
            <label htmlFor="remember" className="small">
              Remember me
            </label>
          </div>
          <Link to="/pages/forgot-password" className="small text-accent text-decoration-none">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" label="Sign In" loading={isSubmitting} className="w-100 mb-3" />
        <p className="text-center small text-muted mb-0">
          Don&apos;t have an account?{' '}
          <Link to="/pages/register" className="text-accent text-decoration-none">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

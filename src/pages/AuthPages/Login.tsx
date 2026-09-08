import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/AuthContext';
import { loginSchema, type LoginFormValues } from './AuthSchema';
import AuthShell from '../../components/common/AuthShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Field } from '../../components/ui/Field';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const _from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';
  void _from; // used by Guard's redirect after workspace selection

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setError('');
    try {
      await login(values);
      navigate('/workspaces', { replace: true });
    } catch {
      setError('Invalid email or password.');
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Aegis workspace.">
      {error && (
        <div
          className="mb-4 flex items-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-[0.8125rem] text-danger"
          role="alert"
        >
          <i className="bi bi-exclamation-circle" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Field label="Work email" htmlFor="login-email" error={errors.email?.message}>
          <Input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            invalid={!!errors.email}
            {...register('email')}
          />
        </Field>

        <Field label="Password" htmlFor="login-password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="login-password"
              className="pr-10"
              type={showPassword ? 'text' : 'password'}
              invalid={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-0 top-0 grid h-9 w-10 place-items-center text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          </div>
        </Field>

        <Button id="login-submit" type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/AuthContext';
import { loginSchema, type LoginFormValues } from './AuthSchema';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // After login the user must pick a workspace — honour the original destination
  // only after the full flow is complete (Guard handles that redirect).
  // Preserve the intended destination for after the full auth flow completes
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
      // Step 1 complete — user now has a user-level token.
      // They must select a workspace before reaching the main app.
      navigate('/workspaces', { replace: true });
    } catch {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="mb-4">
          <h1>Welcome back</h1>
          <p className="text-muted mb-0">Sign in to your Aegis workspace.</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13.5 }} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Work email
            </label>
            <input
              id="login-email"
              type="email"
              className="w-100 form-control form-control-sm"
              placeholder="you@company.com"
              {...register('email')}
            />
            {errors.email && (
              <div className="text-danger small mt-1" role="alert">
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>

            <div className="position-relative">
              <input
                id="login-password"
                className="form-control form-control-sm pe-5"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
              />

              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y border-0 p-1 pe-2"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i
                  className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                />
              </button>
            </div>

            {errors.password && (
              <div className="text-danger small mt-1" role="alert">
                {errors.password.message}
              </div>
            )}
          </div>

          <Button
            id="login-submit"
            type="submit"
            text={isSubmitting ? 'Signing in…' : 'Sign in'}
            className="w-100"
            loading={isSubmitting}
            intent="primary"
            fill
          />
        </form>
      </div>
    </div>
  );
}

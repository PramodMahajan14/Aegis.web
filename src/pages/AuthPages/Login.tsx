import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { Button, InputGroup } from '@blueprintjs/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/AuthContext';
import { loginSchema, type LoginFormValues } from './AuthSchema';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';

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
  console.log(error)

  async function onSubmit(values: LoginFormValues) {
    try {
      const mustResetPassword = await login(values);
      // navigate(mustResetPassword ? '/change-password' : from, { replace: true });
    } catch {
      setError('Invalid workspace, email, or password.');
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="mb-4">
          <h1>Welcome back</h1>
          <p className="text-muted mb-0">Sign in to your Aegis workspace.</p>
        </div>

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
            <input
              id="login-password"
              className="w-100 form-control form-control-sm"
              type={showPassword ? 'text' : 'password'}
              // rightElement={
              //   <Button
              //     icon={showPassword ? 'eye-off' : 'eye-open'}
              //     variant="minimal"
              //     onClick={() => setShowPassword((v) => !v)}
              //   />
              // }
              {...register('password')}
            />
            {errors.password && (
              <div className="text-danger small mt-1" role="alert">
                {errors.password.message}
              </div>
            )}
          </div>



          <Button
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

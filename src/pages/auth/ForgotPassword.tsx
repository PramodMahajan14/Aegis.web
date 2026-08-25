import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../schemas/auth';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await new Promise((r) => setTimeout(r, 400));
    console.log('forgot-password', values);
    setSent(true);
  }

  return (
    <div className="auth-card">
      <div className="text-center mb-4">
        <i className="bi bi-key text-accent fs-2" />
        <h5 className="fw-bold mt-2" style={{ color: 'var(--lucid-text-strong)' }}>
          Forgot Password?
        </h5>
        <p className="text-muted small mb-0">Enter your email to receive a reset link</p>
      </div>
      {sent && <Message severity="success" text="Reset link sent, check your inbox." className="w-100 mb-3" />}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              type="email"
              placeholder="you@company.com"
              className={'w-100 mb-1' + (errors.email ? ' p-invalid' : '')}
            />
          )}
        />
        {errors.email && <div className="invalid-feedback d-block mb-2">{errors.email.message}</div>}
        <Button type="submit" label="Send Reset Link" loading={isSubmitting} className="w-100 mb-3 mt-2" />
        <p className="text-center small mb-0">
          <Link to="/pages/login" className="text-accent text-decoration-none">
            <i className="bi bi-arrow-left me-1" />
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}

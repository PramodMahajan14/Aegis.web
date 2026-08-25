import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { lockscreenSchema, type LockscreenFormValues } from '../../schemas/auth';

export default function Lockscreen() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LockscreenFormValues>({
    resolver: zodResolver(lockscreenSchema),
    defaultValues: { password: '' },
  });

  async function onSubmit(values: LockscreenFormValues) {
    await new Promise((r) => setTimeout(r, 400));
    console.log('unlock', values);
    navigate('/');
  }

  return (
    <div className="auth-card text-center">
      <Avatar
        label="AT"
        shape="circle"
        size="xlarge"
        className="mb-3"
        style={{ background: 'var(--lucid-accent)', color: '#fff', width: 72, height: 72, fontSize: '1.5rem' }}
      />
      <h5 className="fw-bold" style={{ color: 'var(--lucid-text-strong)' }}>
        Alizee Thomas
      </h5>
      <p className="text-muted small mb-3">Enter your password to unlock</p>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Password
              {...field}
              inputClassName="w-100"
              className={'w-100 mb-1' + (errors.password ? ' p-invalid' : '')}
              placeholder="Password"
              feedback={false}
              toggleMask
            />
          )}
        />
        {errors.password && <div className="invalid-feedback d-block mb-2">{errors.password.message}</div>}
        <Button type="submit" loading={isSubmitting} className="w-100 mt-2">
          <i className="bi bi-unlock me-2" />
          Unlock
        </Button>
      </form>
    </div>
  );
}

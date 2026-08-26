import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { Button, InputGroup } from '@blueprintjs/core';
import { useAuth } from '../auth/AuthContext';


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';

  const [tenant, setTenant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      await login(tenant.trim(), email.trim(), password);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid workspace, email, or password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="mb-4">
          <h1>Welcome back</h1>
          <p className="text-muted mb-0">Sign in to your Aegis workspace.</p>
        </div>

        <form onSubmit={handleSubmit}>


          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Work email
            </label>
            <InputGroup
              id="login-email"
              type="email"
              className="w-100"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <InputGroup
              id="login-password"
              className="w-100"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <Button
                  icon={showPassword ? 'eye-off' : 'eye-open'}
                  variant="minimal"
                  onClick={() => setShowPassword((v) => !v)}
                />
              }
              required
            />
          </div>


          {error && (
            <div className="text-danger mb-3" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" text={busy ? 'Signing in…' : 'Sign in'} className="w-100" loading={busy} intent="primary" fill />
        </form>
      </div>
    </div>
  );
}

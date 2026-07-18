import React, { useState } from 'react';
import { Building2, LockKeyhole, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('owner@vumtech.example');
  const [password, setPassword] = useState('demo123');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login({ email, password, rememberMe: true });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-slate-950">Demo Tenant Login</h1>
            <p className="text-sm text-slate-600">Sign in to open the app launcher.</p>
          </div>
        </div>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <span className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
        </span>
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <span className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
        </span>
      </label>

      <Button className="h-11 w-full" loading={isLoading}>Login to App Launcher</Button>
      <p className="text-center text-xs text-slate-500">Demo only. Any email/password will sign in locally.</p>
    </form>
  );
};

export default Login;

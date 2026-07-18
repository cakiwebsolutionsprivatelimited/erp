import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.32),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.24),transparent_26%),linear-gradient(135deg,#020617,#0f172a)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_430px] lg:items-center">
        <div className="hidden text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-200">Indian SME SaaS workspace</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">One launcher for every business app.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Demo CRM, Sales, Billing, Inventory, HR, Services, Marketing, and Settings in a modular tenant product experience.
          </p>
        </div>

        <div className="w-full space-y-6 rounded-2xl border border-white/10 bg-white p-6 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-xl font-bold text-white shadow-lg">
              V
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">VumTech Business Suite</h2>
            <p className="mt-2 text-sm text-slate-500">Demo tenant prototype</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

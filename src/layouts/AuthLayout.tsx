import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <span className="text-primary-foreground font-bold text-2xl">E</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Enterprise SaaS
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Scalable solution for your business
          </p>
        </div>
        
        <div className="bg-background shadow-xl rounded-2xl border p-8 backdrop-blur-sm bg-white/70 dark:bg-black/50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

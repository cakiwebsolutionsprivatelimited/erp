import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/features/authSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    dispatch(setCredentials({
      user: { id: '1', email: 'admin@example.com', name: 'John Doe', role: 'admin' },
      token: 'fake-jwt-token'
    }));
    navigate('/');
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-2.5 bg-muted/30 border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          placeholder="name@company.com"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-foreground">
            Password
          </label>
          <Link to="/forgot-password" size="sm" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          required
          className="w-full px-4 py-2.5 bg-muted/30 border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          className="h-4 w-4 text-primary border-muted rounded focus:ring-primary/20"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        Sign in
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Create one now
        </Link>
      </p>
    </form>
  );
};

export default Login;

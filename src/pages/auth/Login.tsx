import React from 'react';
import { z } from 'zod';
import { FormWrapper } from '@/components/forms/FormWrapper';
import { FormInput, FormCheckbox } from '@/components/forms/FormComponents';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();

  const onSubmit = async (values: LoginData) => {
    await login(values);
  };

  return (
    <FormWrapper
      schema={loginSchema}
      defaultValues={{ email: '', password: '', rememberMe: false }}
      onSubmit={onSubmit}
      submitLabel="Sign In"
      isLoading={isLoading}
    >
      {() => (
        <div className="space-y-4">
          <FormInput 
            name="email" 
            label="Email" 
            placeholder="name@company.com" 
            type="email" 
          />
          <div className="relative">
            <FormInput 
              name="password" 
              label="Password" 
              placeholder="••••••••" 
              type="password" 
            />
            <Link 
              to="/forgot-password" 
              className="absolute right-0 top-0 text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          
          <FormCheckbox 
            name="rememberMe" 
            label="Remember me for 30 days" 
            className="border-none p-0 shadow-none"
          />

          <p className="text-center text-sm text-muted-foreground pt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      )}
    </FormWrapper>
  );
};

export default Login;

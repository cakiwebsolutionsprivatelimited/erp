import React from 'react';
import { z } from 'zod';
import { FormWrapper } from '@/components/forms/FormWrapper';
import { FormInput } from '@/components/forms/FormComponents';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '@/services/notificationService';

const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (values: SignupData) => {
    void values;
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      notify.success('Account created!', 'Please login with your credentials.');
      navigate('/login');
    } catch (error: unknown) {
      notify.error('Signup Failed', error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper
      schema={signupSchema}
      defaultValues={{ name: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={onSubmit}
      submitLabel="Create Account"
      isLoading={isLoading}
    >
      {() => (
        <div className="space-y-4">
          <FormInput 
            name="name" 
            label="Full Name" 
            placeholder="John Doe" 
          />
          <FormInput 
            name="email" 
            label="Email Address" 
            placeholder="john@example.com" 
            type="email" 
          />
          <FormInput 
            name="password" 
            label="Password" 
            placeholder="••••••••" 
            type="password" 
          />
          <FormInput 
            name="confirmPassword" 
            label="Confirm Password" 
            placeholder="••••••••" 
            type="password" 
          />

          <p className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      )}
    </FormWrapper>
  );
};

export default Signup;

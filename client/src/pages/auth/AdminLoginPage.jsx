import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import PageMeta from '@/components/common/PageMeta';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FormField } from '@/components/forms/FormField';
import { inputClassName } from '@/constants/forms';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLoginPage() {
  const { login, isAuthenticated, isBootstrapping } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success('Welcome back');
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Admin Login" description="Sign in to the Aaron Jersey World admin dashboard." path="/admin/login" />
      <div className="flex min-h-screen items-center justify-center bg-brand-black px-4">
        <div className="w-full max-w-md rounded-card border border-white/10 bg-white p-8 shadow-card">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-red">Admin</p>
          <h1 className="mb-2">Sign in</h1>
          <p className="mb-8 text-text-muted">Access the Aaron Jersey World dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
              <input id="email" type="email" autoComplete="email" className={inputClassName} {...register('email')} />
            </FormField>

            <FormField label="Password" htmlFor="password" required error={errors.password?.message}>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={inputClassName}
                {...register('password')}
              />
            </FormField>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

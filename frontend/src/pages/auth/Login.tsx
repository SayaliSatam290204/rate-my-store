import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { login as loginApi } from '../../api/auth.api';
import { useAuth, getRoleHome } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import type { LoginFormData } from '../../utils/validators';
import type { ApiResponse } from '../../types';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => loginApi(data.email, data.password),
    onSuccess: (data) => {
      login(data.token);
      navigate(getRoleHome(data.user.role));
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    },
  });

  if (isAuthenticated && user) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return (
    <AuthLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Sign In</h2>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Sign In
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

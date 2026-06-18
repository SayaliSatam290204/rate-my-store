import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { register as registerApi } from '../../api/auth.api';
import { useToast } from '../../hooks/useToast';
import { registerSchema } from '../../utils/validators';
import type { RegisterFormData } from '../../utils/validators';
import type { ApiResponse } from '../../types';

export const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerApi(data),
    onSuccess: () => {
      showToast('Registration successful! Please login.', 'success');
      navigate('/login');
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      const message = err.response?.data?.message || 'Registration failed.';
      setError('root', { message });
    },
  });

  return (
    <AuthLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Create Account</h2>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Input
          label="Name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Address"
          error={errors.address?.message}
          {...register('address')}
        />
        <Select
          label="Role"
          error={errors.role?.message}
          options={[
            { value: 'user', label: 'Store Rater (Normal User)' },
            { value: 'store_owner', label: 'Store Owner' },
          ]}
          {...register('role')}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        {errors.root && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Register
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

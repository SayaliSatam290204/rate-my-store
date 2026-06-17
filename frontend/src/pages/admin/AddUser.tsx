import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createUser } from '../../api/users.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { createUserSchema } from '../../utils/validators';
import type { CreateUserFormData } from '../../utils/validators';
import type { ApiResponse } from '../../types';

export const AddUser = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'user' },
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showToast('User created successfully!', 'success');
      navigate('/admin/users');
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      setError('root', {
        message: err.response?.data?.message || 'Failed to create user.',
      });
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Add User</h1>
      <div className="max-w-lg rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Address" error={errors.address?.message} {...register('address')} />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('role')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
          </div>
          {errors.root && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.root.message}</p>
          )}
          <div className="flex gap-3">
            <Button type="submit" loading={mutation.isPending}>
              Create User
            </Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/users')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

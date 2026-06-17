import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { changePassword } from '../../api/users.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { changePasswordSchema } from '../../utils/validators';
import type { ChangePasswordFormData } from '../../utils/validators';
import type { ApiResponse } from '../../types';

export const ChangePassword = () => {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      showToast('Password updated successfully', 'success');
      reset();
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      setError('root', {
        message: err.response?.data?.message || 'Failed to update password.',
      });
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Change Password</h1>
      <div className="max-w-lg rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {errors.root && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.root.message}</p>
          )}
          <Button type="submit" loading={mutation.isPending}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

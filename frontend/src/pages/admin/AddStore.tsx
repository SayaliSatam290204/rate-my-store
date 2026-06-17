import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createStore } from '../../api/stores.api';
import { getUsers } from '../../api/users.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { createStoreSchema } from '../../utils/validators';
import type { CreateStoreFormData } from '../../utils/validators';
import type { ApiResponse } from '../../types';

export const AddStore = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: ownersData } = useQuery({
    queryKey: ['store-owners'],
    queryFn: () => getUsers({ role: 'store_owner', limit: 100 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
  });

  const mutation = useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      showToast('Store created successfully!', 'success');
      navigate('/admin/stores');
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      setError('root', {
        message: err.response?.data?.message || 'Failed to create store.',
      });
    },
  });

  const storeOwners = ownersData?.users.filter((u) => u.role === 'store_owner') || [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Add Store</h1>
      <div className="max-w-lg rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Address" error={errors.address?.message} {...register('address')} />
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Owner (Optional)
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('ownerId')}
            >
              <option value="">No owner assigned</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          </div>
          {errors.root && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.root.message}</p>
          )}
          <div className="flex gap-3">
            <Button type="submit" loading={mutation.isPending}>
              Create Store
            </Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/stores')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getUserById } from '../../api/users.api';
import { Button } from '../../components/ui/Button';
import { Badge, formatRole, getRoleBadgeColor } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Spinner } from '../../components/ui/Spinner';

export const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">User not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/admin/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        className="mb-6"
        onClick={() => navigate('/admin/users')}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">User Details</h1>
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.address}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Role</dt>
            <dd className="mt-1">
              <Badge color={getRoleBadgeColor(user.role)}>
                {formatRole(user.role)}
              </Badge>
            </dd>
          </div>
          {user.role === 'store_owner' && user.storeAverageRating !== undefined && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Store Average Rating
              </dt>
              <dd className="mt-2 flex items-center gap-2">
                <StarRating value={user.storeAverageRating} readonly size="lg" />
                <span className="text-sm text-gray-600">
                  ({user.storeAverageRating.toFixed(1)})
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyStoreRatings } from '../../api/ratings.api';
import { Table } from '../../components/ui/Table';
import { StarRating } from '../../components/ui/StarRating';
import { Spinner } from '../../components/ui/Spinner';

export const OwnerDashboard = () => {
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-store-ratings', sort],
    queryFn: () => getMyStoreRatings({ sortBy: sort.key, sortOrder: sort.direction }),
  });

  const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  }, []);

  const columns = [
    { label: 'User Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email' },
    {
      label: 'Rating',
      key: 'rating',
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <StarRating value={row.rating as number} readonly />
      ),
    },
    {
      label: 'Date Submitted',
      key: 'submittedAt',
      render: (row: Record<string, unknown>) =>
        new Date(row.submittedAt as string).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
        <p className="text-gray-500">No store assigned yet. Contact your administrator.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">My Store Dashboard</h1>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Average Rating
        </p>
        <p className="mt-2 text-5xl font-bold text-gray-900">
          {data?.averageRating.toFixed(1) ?? '0.0'}
        </p>
        <div className="mt-3 flex justify-center">
          <StarRating value={data?.averageRating ?? 0} readonly size="lg" />
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Based on {data?.totalRatings ?? 0} rating{(data?.totalRatings ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Ratings</h2>
      <Table
        columns={columns}
        data={(data?.raters as unknown as Record<string, unknown>[]) || []}
        onSort={handleSort}
        currentSort={sort}
        loading={false}
        emptyMessage="No ratings yet."
      />
    </div>
  );
};

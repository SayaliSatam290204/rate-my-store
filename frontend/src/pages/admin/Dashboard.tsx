import { useQuery } from '@tanstack/react-query';
import { Users, Store, Star } from 'lucide-react';
import { getStats } from '../../api/dashboard.api';

const StatCard = ({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
}) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    {loading ? (
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-16 rounded bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className="rounded-lg bg-indigo-50 p-3">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{label}</p>
      </>
    )}
  </div>
);

export const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total Users"
          value={data?.totalUsers ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          label="Total Stores"
          value={data?.totalStores ?? 0}
          icon={Store}
          loading={isLoading}
        />
        <StatCard
          label="Total Ratings"
          value={data?.totalRatings ?? 0}
          icon={Star}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

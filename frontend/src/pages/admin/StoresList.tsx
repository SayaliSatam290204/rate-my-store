import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStores } from '../../api/stores.api';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';

export const StoresList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores', debouncedFilters, sort],
    queryFn: () =>
      getStores(debouncedFilters, { sortBy: sort.key, sortOrder: sort.direction }),
  });

  const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  }, []);

  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Address', key: 'address' },
    {
      label: 'Average Rating',
      key: 'averageRating',
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-2">
          <StarRating value={(row.averageRating as number) || 0} readonly />
          <span className="text-sm text-gray-500">
            ({((row.averageRating as number) || 0).toFixed(1)})
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Stores</h1>
        <Button onClick={() => navigate('/admin/stores/add')}>Add Store</Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-4 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Input
          label="Address"
          placeholder="Search by address..."
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
      </div>

      <Table
        columns={columns}
        data={(stores as unknown as Record<string, unknown>[]) || []}
        onSort={handleSort}
        currentSort={sort}
        loading={isLoading}
        emptyMessage="No stores found."
      />
    </div>
  );
};

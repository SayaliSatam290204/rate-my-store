import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/users.api';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge, formatRole, getRoleBadgeColor } from '../../components/ui/Badge';

export const UsersList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ['users', debouncedFilters, sort, page],
    queryFn: () =>
      getUsers(
        {
          ...debouncedFilters,
          role: debouncedFilters.role || undefined,
          page,
          limit: 20,
        },
        { sortBy: sort.key, sortOrder: sort.direction }
      ),
  });

  const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  }, []);

  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Address', key: 'address' },
    {
      label: 'Role',
      key: 'role',
      render: (row: Record<string, unknown>) => (
        <Badge color={getRoleBadgeColor(row.role as string)}>
          {formatRole(row.role as string)}
        </Badge>
      ),
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row: Record<string, unknown>) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/admin/users/${row.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <Button onClick={() => navigate('/admin/users/add')}>Add User</Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-4 md:grid-cols-4">
        <Input
          label="Name"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Input
          label="Email"
          placeholder="Search by email..."
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <Input
          label="Address"
          placeholder="Search by address..."
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
            Role
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={(data?.users as unknown as Record<string, unknown>[]) || []}
        onSort={handleSort}
        currentSort={sort}
        loading={isLoading}
        emptyMessage="No users found."
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

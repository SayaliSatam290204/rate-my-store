import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStores } from '../../api/stores.api';
import { submitRating } from '../../api/ratings.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../hooks/useToast';
import type { Store } from '../../types';

export const StoresBrowse = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ['stores-browse', debouncedFilters, page],
    queryFn: () => getStores({ ...debouncedFilters, page, limit: 20 }, { sortBy: 'name', sortOrder: 'asc' }),
  });

  const stores: Store[] = (data && 'stores' in data ? data.stores : []) as Store[];
  const pagination = data && 'pagination' in data ? data.pagination : undefined;

  const ratingMutation = useMutation({
    mutationFn: ({ storeId, value }: { storeId: number; value: number }) =>
      submitRating(storeId, value),
    onSuccess: () => {
      showToast('Rating submitted successfully!', 'success');
      setModalOpen(false);
      setSelectedStore(null);
      queryClient.invalidateQueries({ queryKey: ['stores-browse'] });
    },
    onError: () => {
      showToast('Failed to submit rating.', 'error');
    },
  });

  const openRatingModal = (store: Store) => {
    setSelectedStore(store);
    setRatingValue(store.userRating || 0);
    setModalOpen(true);
  };

  const handleSubmitRating = () => {
    if (!selectedStore || ratingValue < 1) return;
    ratingMutation.mutate({ storeId: selectedStore.id, value: ratingValue });
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Browse Stores</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-4 md:grid-cols-2">
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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-6">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-full rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : stores && stores.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{store.address}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Overall Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <StarRating value={store.averageRating} readonly />
                    <span className="text-sm text-gray-500">
                      ({store.averageRating.toFixed(1)})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Your Rating
                  </span>
                  {store.userRating ? (
                    <StarRating value={store.userRating} readonly />
                  ) : (
                    <span className="text-sm text-gray-400">Not rated yet</span>
                  )}
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                size="sm"
                onClick={() => openRatingModal(store)}
              >
                {store.userRating ? 'Update Rating' : 'Rate Store'}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-400">No stores found.</p>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Rate ${selectedStore?.name || 'Store'}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select your rating (1-5 stars):</p>
          <div className="flex justify-center">
            <StarRating value={ratingValue} onChange={setRatingValue} size="lg" />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmitRating}
            loading={ratingMutation.isPending}
            disabled={ratingValue < 1}
          >
            Submit Rating
          </Button>
        </div>
      </Modal>
    </div>
  );
};

import axiosInstance from './axiosInstance';
import type { ApiResponse, Rating, StoreOwnerDashboard, SortParams } from '../types';

export const submitRating = async (storeId: number, value: number): Promise<Rating> => {
  const response = await axiosInstance.post<ApiResponse<Rating>>('/ratings', {
    storeId,
    value,
  });
  return response.data.data;
};

export const getMyStoreRatings = async (
  sort?: SortParams
): Promise<StoreOwnerDashboard> => {
  const response = await axiosInstance.get<ApiResponse<StoreOwnerDashboard>>(
    '/ratings/my-store',
    { params: sort }
  );
  return response.data.data;
};

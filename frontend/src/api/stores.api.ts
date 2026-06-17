import axiosInstance from './axiosInstance';
import type { ApiResponse, Store, CreateStoreData, StoreFilters, SortParams, StoresListResponse } from '../types';

export const getStores = async (
  filters: StoreFilters = {},
  sort: SortParams = {}
): Promise<Store[] | StoresListResponse> => {
  const response = await axiosInstance.get<ApiResponse<Store[] | StoresListResponse>>('/stores', {
    params: { ...filters, ...sort },
  });
  return response.data.data;
};

export const createStore = async (data: CreateStoreData): Promise<Store> => {
  const response = await axiosInstance.post<ApiResponse<Store>>('/stores', data);
  return response.data.data;
};

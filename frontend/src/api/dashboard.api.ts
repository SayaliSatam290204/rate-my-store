import axiosInstance from './axiosInstance';
import type { ApiResponse, DashboardStats } from '../types';

export const getStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  return response.data.data;
};

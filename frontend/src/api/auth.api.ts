import axiosInstance from './axiosInstance';
import type { ApiResponse, LoginResponse, RegisterData } from '../types';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', {
    email,
    password,
  });
  return response.data.data;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/register', data);
  return response.data.data;
};

import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  User,
  UsersListResponse,
  CreateUserData,
  ChangePasswordData,
  UserFilters,
  SortParams,
} from '../types';

export const getUsers = async (
  filters: UserFilters = {},
  sort: SortParams = {}
): Promise<UsersListResponse> => {
  const response = await axiosInstance.get<ApiResponse<UsersListResponse>>('/users', {
    params: { ...filters, ...sort },
  });
  return response.data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
  return response.data.data;
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await axiosInstance.post<ApiResponse<User>>('/users', data);
  return response.data.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await axiosInstance.patch('/users/change-password', data);
};

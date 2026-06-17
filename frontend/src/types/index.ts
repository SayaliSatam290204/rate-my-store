export type UserRole = 'admin' | 'user' | 'store_owner';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
  storeAverageRating?: number;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  userRating?: number | null;
}

export interface Rating {
  id: number;
  value: number;
  userId: number;
  storeId: number;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface RaterInfo {
  name: string;
  email: string;
  rating: number;
  submittedAt: string;
}

export interface StoreOwnerDashboard {
  averageRating: number;
  totalRatings: number;
  raters: RaterInfo[];
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface CreateUserData extends RegisterData {
  role: UserRole;
}

export interface CreateStoreData {
  name: string;
  email: string;
  address: string;
  ownerId?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StoreFilters {
  name?: string;
  address?: string;
  page?: number;
  limit?: number;
}

export interface StoresListResponse {
  stores: Store[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

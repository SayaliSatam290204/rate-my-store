import { useAuthContext } from '../context/AuthContext';
import type { UserRole } from '../types';

export const useAuth = () => {
  return useAuthContext();
};

export const getRoleHome = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'user':
      return '/user/stores';
    case 'store_owner':
      return '/owner/dashboard';
    default:
      return '/login';
  }
};

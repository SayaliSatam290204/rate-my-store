import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, getRoleHome } from '../hooks/useAuth';
import type { UserRole } from '../types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Outlet />;
};

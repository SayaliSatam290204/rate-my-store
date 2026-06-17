import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  KeyRound,
  BarChart3,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Stores', path: '/admin/stores', icon: Store },
  ],
  user: [
    { label: 'Browse Stores', path: '/user/stores', icon: ShoppingBag },
    { label: 'Change Password', path: '/user/change-password', icon: KeyRound },
  ],
  store_owner: [
    { label: 'My Store Dashboard', path: '/owner/dashboard', icon: BarChart3 },
    { label: 'Change Password', path: '/owner/change-password', icon: KeyRound },
  ],
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const navItems = user ? navItemsByRole[user.role] : [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <h1 className="text-lg font-bold text-indigo-600">RateMyStore</h1>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 lg:hidden">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

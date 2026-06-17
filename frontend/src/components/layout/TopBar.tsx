import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge, formatRole, getRoleBadgeColor } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <Badge color={getRoleBadgeColor(user.role)}>
                {formatRole(user.role)}
              </Badge>
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

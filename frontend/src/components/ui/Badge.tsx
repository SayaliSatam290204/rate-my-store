interface BadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'blue' | 'green' | 'gray';
}

const colorClasses = {
  purple: 'bg-purple-100 text-purple-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-800',
};

export const Badge = ({ children, color = 'gray' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

export const getRoleBadgeColor = (role: string): 'purple' | 'blue' | 'green' => {
  switch (role) {
    case 'admin':
      return 'purple';
    case 'store_owner':
      return 'green';
    default:
      return 'blue';
  }
};

export const formatRole = (role: string): string => {
  return role.replace('_', ' ');
};

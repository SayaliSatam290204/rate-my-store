import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    iconColor: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right ${config.bg}`}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
      <p className={`text-sm font-medium ${config.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`ml-2 rounded p-0.5 hover:bg-black/5 ${config.text}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

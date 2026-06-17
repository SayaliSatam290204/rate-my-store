import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">RateMyStore</h1>
          <p className="mt-2 text-sm text-gray-600">Store rating platform</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

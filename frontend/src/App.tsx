import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './hooks/useToast';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/admin/Dashboard';
import { UsersList } from './pages/admin/UsersList';
import { UserDetail } from './pages/admin/UserDetail';
import { AddUser } from './pages/admin/AddUser';
import { StoresList } from './pages/admin/StoresList';
import { AddStore } from './pages/admin/AddStore';
import { StoresBrowse } from './pages/user/StoresBrowse';
import { ChangePassword as UserChangePassword } from './pages/user/ChangePassword';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { ChangePassword as OwnerChangePassword } from './pages/owner/ChangePassword';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route element={<RoleRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/users" element={<UsersList />} />
                    <Route path="/admin/users/add" element={<AddUser />} />
                    <Route path="/admin/users/:id" element={<UserDetail />} />
                    <Route path="/admin/stores" element={<StoresList />} />
                    <Route path="/admin/stores/add" element={<AddStore />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={['user']} />}>
                    <Route path="/user/stores" element={<StoresBrowse />} />
                    <Route path="/user/change-password" element={<UserChangePassword />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={['store_owner']} />}>
                    <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                    <Route path="/owner/change-password" element={<OwnerChangePassword />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

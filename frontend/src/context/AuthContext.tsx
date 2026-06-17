import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string): AuthUser | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const validRoles: UserRole[] = ['admin', 'user', 'store_owner'];
    if (!validRoles.includes(payload.role)) {
      return null;
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token && !!user,
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

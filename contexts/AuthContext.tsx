import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { authService, AuthResponse } from '../services/api';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Authentication context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for using authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

// Authentication context provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check initial authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in local storage
        if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
          try {
            // Here we could call API to validate token
            // For now, get user info from local storage
            const userStr = localStorage.getItem('user');
            if (userStr) {
              setUser(JSON.parse(userStr));
            }
          } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear invalid data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect unauthenticated users from protected routes
  useEffect(() => {
    // Skip during SSR or when still loading
    if (typeof window === 'undefined' || loading) return;
    
    // Get current path
    const path = router.pathname;
    
    // Skip for login and register pages
    if (path === '/login' || path === '/register') return;
    
    // If user is not authenticated and tries to access a protected route
    if (!user && path !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Login method
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('AuthContext: Starting login process, calling API');
      // Direct API login call, no route redirection here
      const response: AuthResponse = await authService.login({ email, password });
      console.log('AuthContext: Received API response:', response);
      
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('AuthContext: User info saved');
        return response.user;
      } else {
        console.error('AuthContext: API response missing user info');
        throw new Error('Login successful but user info invalid');
      }
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register method
  const register = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      await authService.register({ name, email, password, role });
      // Redirect to login page after successful registration
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 
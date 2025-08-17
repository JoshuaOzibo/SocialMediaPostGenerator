"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStatus, useLogout } from '@/hooks/api/useAuth';
import { toast } from 'sonner';

interface User {
  id?: string;
  email?: string;
  username?: string;
  user_metadata?: {
    full_name?: string;
    email?: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: unknown;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/history'];
// Public routes that should redirect to dashboard if authenticated
const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/auth', '/'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, error } = useAuthStatus();
  const logoutMutation = useLogout();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      const hasToken = authApi.isAuthenticated();
      
      if (!hasToken && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        // User is not authenticated but trying to access protected route
        router.push('/auth/login');
        return;
      }
      
      if (hasToken && PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        // User is authenticated but on public route, redirect to hom
        if (pathname === '/') {
          router.push('/');
        }
        return;
      }
    };

    // Only check auth after initial load to prevent hydration issues
    if (typeof window !== 'undefined') {
      checkAuth();
      setIsInitialized(true);
    }
  }, [pathname, router, isAuthenticated]);

  // Handle authentication state changes
  useEffect(() => {
    if (!isInitialized) return;

    if (error && !isLoading) {
      // If there's an auth error and we're not loading, user might be logged out
      // if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      //   toast.error('Session expired. Please log in again.');
      //   router.push('/auth/login');
      // }
    }
  }, [error, isLoading, pathname, router, isInitialized]);

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
        router.push('/auth/login');
      },
      onError: () => {
        // Even if logout API fails, clear local storage and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('backendSession');
        localStorage.removeItem('backendUser');
        toast.success('Logged out successfully');
        router.push('/auth/login');
      }
    });
  };

  const checkAuthStatus = (): boolean => {
    return authApi.isAuthenticated();
  };

  const value: AuthContextType = {
    isAuthenticated,
    user: user as User | null,
    isLoading,
    error,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

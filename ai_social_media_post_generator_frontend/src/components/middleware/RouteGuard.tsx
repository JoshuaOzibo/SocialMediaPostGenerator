"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/history'];
// Routes that should redirect authenticated users
const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth'];

export default function RouteGuard({ 
  children, 
  requireAuth = false,
  redirectTo 
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth context to initialize
      if (isLoading) return;

      const hasToken = authApi.isAuthenticated();
      const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
      const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

      // If route requires auth but user is not authenticated
      if ((requireAuth || isProtectedRoute) && !hasToken) {
        router.push(redirectTo || '/auth/login');
        return;
      }

      // If user is authenticated but on auth pages, redirect to dashboard
      if (hasToken && isAuthRoute) {
        router.push('/dashboard');
        return;
      }

      // If user is authenticated and on home page, redirect to dashboard
      if (hasToken && pathname === '/') {
        router.push('/dashboard');
        return;
      }

    };

    checkAccess();
  }, [isLoading, isAuthenticated, pathname, router, requireAuth, redirectTo]);

  

  return <>{children}</>;
}



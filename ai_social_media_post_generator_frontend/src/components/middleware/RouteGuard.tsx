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

const PROTECTED_ROUTES = ['/dashboard', '/history'];
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
      if (isLoading) return;

      const hasToken = authApi.isAuthenticated();
      const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
      const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

      if ((requireAuth || isProtectedRoute) && !hasToken) {
        router.push(redirectTo || '/auth/login');
        return;
      }

      if (hasToken && isAuthRoute) {
        router.push('/dashboard');
        return;
      }

      if (hasToken && pathname === '/') {
        router.push('/dashboard');
        return;
      }

    };

    checkAccess();
  }, [isLoading, isAuthenticated, pathname, router, requireAuth, redirectTo]);

  const hasToken = authApi.isAuthenticated();
  const showContent = !requireAuth || hasToken;

  if (requireAuth && !hasToken && !isLoading) {
    return null;
  }

  return <>{showContent ? children : null}</>;
}



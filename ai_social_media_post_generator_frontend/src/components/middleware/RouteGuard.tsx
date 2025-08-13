"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

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
  const [isChecking, setIsChecking] = useState(true);

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

      setIsChecking(false);
    };

    checkAccess();
  }, [isLoading, isAuthenticated, pathname, router, requireAuth, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Verifying Access
            </h2>
            <p className="text-slate-600 mb-6">
              Please wait while we check your authentication status...
            </p>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If route requires auth but user is not authenticated, show access denied
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Access Denied
            </h2>
            <p className="text-slate-600 mb-6">
              You need to be authenticated to access this page.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}


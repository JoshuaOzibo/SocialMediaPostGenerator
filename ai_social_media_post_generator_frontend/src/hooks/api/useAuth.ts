import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { LoginRequest, SignupRequest, AuthResponse } from '@/lib/api/types';
import { queryKeys } from '@/lib/api/types';

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      
      // Set user data in query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

// Hook for user signup
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: SignupRequest) => authApi.signup(userData),
    onSuccess: (data: AuthResponse) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      
      // Set user data in query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
    onError: (error) => {
      console.error('Signup error:', error);
    },
  });
};

// Hook for user logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries from cache
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Clear cache even if API call fails
      queryClient.clear();
    },
  });
};

// Hook for getting current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: authApi.getCurrentUser,
    enabled: authApi.isAuthenticated(), // Only run if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook for refreshing token
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (data) => {
      // Update token in cache if needed
      console.log('Token refreshed successfully');
    },
    onError: (error) => {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      authApi.logout();
      queryClient.clear();
    },
  });
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  
  return {
    isAuthenticated: !!user,
    user,
    isLoading,
    error,
  };
};

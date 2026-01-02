import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { LoginRequest, SignupRequest } from '@/lib/api/types';
import { queryKeys } from '@/lib/api/types';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data: { session: unknown; user: unknown }) => {

      queryClient.setQueryData(queryKeys.auth.user(), data.user);

      toast.success('Login successful!');

      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      console.error('Login error:', error);

      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        toast.error('Network Error', {
          description: 'Please check your internet connection and try again.',
        });
      } else if (error.response?.status === 401) {
        toast.error('Invalid Credentials', {
          description: 'Please check your email and password.',
        });
      } else if (error.response?.status === 404) {
        toast.error('Service Unavailable', {
          description: 'Authentication service is currently unavailable.',
        });
      } else {
        const errorMessage = (error.response?.data as { message?: string })?.message || 'Login failed. Please try again.';
        toast.error('Login Failed', {
          description: errorMessage,
        });
      }
    },
  });
};

// Hook for user signup
export const useSignup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: SignupRequest) => {
      console.log('Signup data being sent:', userData);
      return authApi.signup(userData);
    },
    onSuccess: (data: { user: unknown; session: unknown }) => {
      // Set user data in query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);

      // Show success message
      toast.success('Account created successfully!');

      // Navigate to dashboard immediately since user is authenticated
      router.push('/dashboard');
    },


    onError: (error: AxiosError) => {
      console.error('Signup error:', error);

      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        toast.error('Network Error', {
          description: 'Please check your internet connection and try again.',
        });
      } else if (error.response?.status === 409) {
        toast.error('Account Already Exists', {
          description: 'An account with this email already exists.',
        });
      } else if (error.response?.status === 400) {
        const errorMessage = (error.response?.data as { error?: string })?.error || 'Please check your input and try again.';
        toast.error('Invalid Data', {
          description: errorMessage,
        });
      } else if (error.response?.status === 404) {
        toast.error('Service Unavailable', {
          description: 'Registration service is currently unavailable.',
        });
      } else {
        const errorMessage = (error.response?.data as { message?: string })?.message || 'Signup failed. Please try again.';
        toast.error('Signup Failed', {
          description: errorMessage,
        });
      }
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
    enabled: typeof window !== 'undefined' && authApi.isAuthenticated(), // Only run on client if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if ((error as AxiosError)?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useAuthStatus = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    };
  }

  return {
    isAuthenticated: !!user,
    user,
    isLoading,
    error,
  };
};

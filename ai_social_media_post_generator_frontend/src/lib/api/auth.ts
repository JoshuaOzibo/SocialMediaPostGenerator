import { api } from './client';
import { LoginRequest, SignupRequest } from './types';
import { setAuthToken, clearAuthData, getAuthToken, isAuthenticated as checkAuthStatus } from '@/lib/utils/auth';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

// Auth API service
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<{ session: unknown; user: unknown }> => {
    const response = await api.post<{ session: unknown; user: unknown }>(AUTH_ENDPOINTS.LOGIN, credentials);
    
    // Backend returns { session, user } directly
    if (response && response.session && response.user) {
      const accessToken = (response.session as { access_token: string }).access_token;
      
      // Store token securely
      setAuthToken(accessToken);
    }
    
    return response;
  },

  // Signup user
  signup: async (userData: SignupRequest): Promise<{ user: unknown; session: unknown; message: string }> => {
    console.log('Making signup request to:', AUTH_ENDPOINTS.SIGNUP);
    console.log('With data:', userData);
    
    try {
      const response = await api.post<{ user: unknown; session: unknown; message: string }>(AUTH_ENDPOINTS.SIGNUP, userData);
      console.log('Signup response:', response);
      
      // Backend now returns { user, session, message } directly
      if (response && response.session && (response.session as { access_token: string }).access_token) {
        const accessToken = (response.session as { access_token: string }).access_token;
        
        // Store token securely
        setAuthToken(accessToken);
      }
      
      return response;
    } catch (error) {
      console.error('Signup API error:', error);
      console.error('Error response data:', (error as any).response?.data);
      console.error('Error response status:', (error as any).response?.status);
      console.error('Error response headers:', (error as any).response?.headers);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data securely
      clearAuthData();
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<unknown> => {
    const response = await api.get<unknown>(AUTH_ENDPOINTS.ME);
    return response;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>(AUTH_ENDPOINTS.REFRESH);
    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return checkAuthStatus();
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return getAuthToken();
  },
};

import { api } from './client';
import { LoginRequest, SignupRequest } from './types';

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
      // Store only the access_token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', (response.session as { access_token: string }).access_token);
      }
    }
    
    return response;
  },

  // Signup user
  signup: async (userData: SignupRequest): Promise<{ user: unknown; session: unknown; message: string }> => {
    const response = await api.post<{ user: unknown; session: unknown; message: string }>(AUTH_ENDPOINTS.SIGNUP, userData);
    
    // Backend now returns { user, session, message } directly
    if (response && response.session && (response.session as { access_token: string }).access_token) {
      // Store only the access_token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', (response.session as { access_token: string }).access_token);
      }
    }
    
    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear only the auth_token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
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
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  // Get stored token
  getStoredToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
};

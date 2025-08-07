import { api } from './client';
import { LoginRequest, SignupRequest, AuthResponse } from './types';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/signin',
  SIGNUP: '/api/v1/auth/signup',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  ME: '/api/v1/auth/me',
} as const;

// Auth API service
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<{ session: unknown; user: unknown }> => {
    const response = await api.post<{ session: unknown; user: unknown }>(AUTH_ENDPOINTS.LOGIN, credentials);
    
    if (response && response.data && response.data.session && response.data.user) {
      // Store session token and user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', (response.data.session as { access_token: string }).access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data!;
  },

  // Signup user
  signup: async (userData: SignupRequest): Promise<{ user: unknown }> => {
    const response = await api.post<{ user: unknown }>(AUTH_ENDPOINTS.SIGNUP, userData);
    
    if (response && response.data && response.data.user) {
      // Store user data in localStorage (no token from signup)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data!;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>(AUTH_ENDPOINTS.ME);
    return response.data!;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>(AUTH_ENDPOINTS.REFRESH);
    
    if (response.success && response.data) {
      // Update token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
    }
    
    return response.data!;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  // Get stored user data
  getStoredUser: (): AuthResponse['user'] | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get stored token
  getStoredToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
};

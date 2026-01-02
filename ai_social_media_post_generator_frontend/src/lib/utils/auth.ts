// Secure token management utilities

/**
 * Set authentication token in both localStorage and cookie
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  // Store in localStorage for client-side access
  localStorage.setItem('auth_token', token);
  
  // Set cookie for server-side access (middleware)
  // Use a simple format that middleware can easily read
  document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Lax`;
  
  // console.log('Token stored in localStorage and cookie');
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('backendSession');
  localStorage.removeItem('backendUser');
  
  // Clear cookie
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // console.log('Auth data cleared');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!getAuthToken();
};

/**
 * Debug function to check authentication state
 */
export const debugAuthState = (): void => {
  if (typeof window === 'undefined') return;
  
  const localStorageToken = localStorage.getItem('auth_token');
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  // console.log('=== Auth Debug Info ===');
  // console.log('localStorage token:', localStorageToken ? 'Present' : 'Missing');
  // console.log('Cookie token:', cookies.auth_token ? 'Present' : 'Missing');
  // console.log('isAuthenticated():', isAuthenticated());
  // console.log('All cookies:', cookies);
  // console.log('=======================');
};

/**
 * Validate token format (basic validation)
 */
export const isValidToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  // Basic JWT format validation (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check if parts are base64 encoded
  try {
    parts.forEach(part => {
      if (part) {
        atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      }
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  return expiration.getTime() < Date.now();
};

/**
 * Refresh token if needed
 */
export const shouldRefreshToken = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  // Refresh if token expires in less than 5 minutes
  const fiveMinutes = 5 * 60 * 1000;
  return expiration.getTime() - Date.now() < fiveMinutes;
};


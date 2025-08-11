import { useState, useCallback, useEffect } from 'react';
import { GoogleAuthResponse, BackendUser, BackendSession } from '@/lib/api/types';
import GoogleAuthService from '@/lib/auth/googleAuthService';

interface UseGoogleAuthReturn {
  signInWithGoogle: (credential: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  user: GoogleAuthResponse['user'] | null;
  isAuthenticated: boolean;
  backendUser: BackendUser | null;
  backendSession: BackendSession | null;
  signOut: () => void;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GoogleAuthResponse['user'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [backendSession, setBackendSession] = useState<BackendSession | null>(null);

  const googleAuthService = GoogleAuthService.getInstance();

  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('googleUser');
    const storedBackendUser = localStorage.getItem('backendUser');
    const storedBackendSession = localStorage.getItem('backendSession');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    if (storedBackendUser) {
      setBackendUser(JSON.parse(storedBackendUser));
    }

    if (storedBackendSession) {
      setBackendSession(JSON.parse(storedBackendSession));
    }
  }, []);

  const signInWithGoogle = useCallback(async (credential: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAuthService.handleGoogleSignIn(credential);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('googleUser', JSON.stringify(response.user));
      localStorage.setItem('googleAccessToken', response.access_token);
      localStorage.setItem('googleTokenExpiry', response.expires_at.toString());
      
      // Check for backend session data
      const storedBackendUser = localStorage.getItem('backendUser');
      const storedBackendSession = localStorage.getItem('backendSession');
      
      if (storedBackendUser) {
        setBackendUser(JSON.parse(storedBackendUser));
      }
      
      if (storedBackendSession) {
        setBackendSession(JSON.parse(storedBackendSession));
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(errorMessage);
      console.error('Google Sign-In Hook Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [googleAuthService]);

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setBackendUser(null);
    setBackendSession(null);
    
    // Clear localStorage
    localStorage.removeItem('googleUser');
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleTokenExpiry');
    localStorage.removeItem('backendUser');
    localStorage.removeItem('backendSession');
    
    console.log('Google Sign-Out Successful');
  }, []);

  return {
    signInWithGoogle,
    isLoading,
    error,
    user,
    isAuthenticated,
    backendUser,
    backendSession,
    signOut,
  };
};

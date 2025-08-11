import { useState, useCallback } from 'react';
import { GoogleAuthResponse } from '@/lib/api/types';
import GoogleAuthService from '@/lib/auth/googleAuthService';

interface UseGoogleAuthReturn {
  signInWithGoogle: (credential: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  user: GoogleAuthResponse['user'] | null;
  isAuthenticated: boolean;
  signOut: () => void;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GoogleAuthResponse['user'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const googleAuthService = GoogleAuthService.getInstance();

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
    
    // Clear localStorage
    localStorage.removeItem('googleUser');
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleTokenExpiry');
    
    console.log('Google Sign-Out Successful');
  }, []);

  return {
    signInWithGoogle,
    isLoading,
    error,
    user,
    isAuthenticated,
    signOut,
  };
};

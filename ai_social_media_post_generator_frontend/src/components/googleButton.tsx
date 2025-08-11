"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/hooks/api/useGoogleAuth';
import { GoogleLogin } from '@react-oauth/google';
import GoogleAuthService from '@/lib/auth/googleAuthService';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { signInWithGoogle, isLoading, error } = useGoogleAuth();
  const googleAuthService = GoogleAuthService.getInstance();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await signInWithGoogle(credentialResponse.credential);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      onError?.(errorMessage);
    }
  };

  const handleGoogleError = () => {
    const errorMessage = 'Google sign-in was cancelled or failed';
    onError?.(errorMessage);
  };

  return (
    <div className="w-full mt-4">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        theme="outline"
        size="large"
        type="standard"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
        locale="en"
        context="signin"
        clientId={googleAuthService.getGoogleClientId()}
        disabled={isLoading}
      />
      
      {error && (
        <div className="mt-2 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
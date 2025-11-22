"use client"

import React from 'react';
import { useGoogleAuth } from '@/hooks/api/useGoogleAuth';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { signInWithGoogle, error } = useGoogleAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      console.log('Google OAuth success, credential received');
      if (credentialResponse.credential) {
        await signInWithGoogle(credentialResponse.credential);
        onSuccess?.();
      } else {
        throw new Error('No credential received from Google');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      console.error('Google sign-in error:', err);
      onError?.(errorMessage);
    }
  };

  const handleGoogleError = () => {
    console.error('Google OAuth error occurred');
    const errorMessage = 'Google sign-in was cancelled or failed. Please try again.';
    onError?.(errorMessage);
  };

  return (
    <div className="w-full mt-4">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        type="standard"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
        locale="en"
        context="signin"
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
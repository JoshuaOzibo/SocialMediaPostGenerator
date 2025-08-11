"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGoogleAuth } from '@/hooks/api/useGoogleAuth';
import { formatUserData } from '@/lib/utils';

const GoogleAuthDemo: React.FC = () => {
  const { user, isAuthenticated, signOut, isLoading, backendUser, backendSession } = useGoogleAuth();

  if (!isAuthenticated || !user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Google Authentication Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in with Google to see your user details
          </p>
          <p className="text-sm text-gray-500">
            Check the browser console for detailed user information
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedUser = formatUserData(user);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Google User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={formattedUser.picture}
            alt={formattedUser.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{formattedUser.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formattedUser.email}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">User ID:</span>
            <span className="font-mono text-xs">{formattedUser.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
            <span className={formattedUser.emailVerified ? 'text-green-600' : 'text-red-600'}>
              {formattedUser.emailVerified ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Backend Authentication Status */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Backend Authentication</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <Badge variant={backendUser ? "default" : "secondary"}>
                {backendUser ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            {backendUser && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Backend User ID:</span>
                  <span className="font-mono text-xs">{backendUser.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Auth Provider:</span>
                  <span className="text-xs">{backendUser.user_metadata?.auth_provider || 'Unknown'}</span>
                </div>
                {backendSession && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Session:</span>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Button
          onClick={signOut}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? 'Signing Out...' : 'Sign Out'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          User details are also logged to the browser console
        </p>
      </CardContent>
    </Card>
  );
};

export default GoogleAuthDemo;

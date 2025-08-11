"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuthService from '@/lib/auth/googleAuthService';

const queryClient = new QueryClient();
const googleAuthService = GoogleAuthService.getInstance();

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
    
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleAuthService.getGoogleClientId()}>
        <TooltipProvider>
          <Toaster position="bottom-right" richColors />
          {/* <Sonner /> */}
          {children}
        </TooltipProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}   
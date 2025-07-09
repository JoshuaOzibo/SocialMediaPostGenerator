"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
    
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="bottom-right" richColors />
      {/* <Sonner /> */}
      {children}
    </TooltipProvider>
    </QueryClientProvider>
  );
}   
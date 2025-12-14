"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import DashBoardNav from "./dashboard_component/dashboard_nav";
import HistoryNav from "./history_components/history_nav";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hide navbar on auth pages
  if (pathname === "/auth/login" || pathname === "/auth/signup" || pathname === "/auth") {
    return null;
  }

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <nav className="container mx-auto lg:px-20 px-3 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {pathname === "/" && (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-slate-900">PostGenius</span>
            </div>
          )}
          {pathname === "/" && (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                disabled={!isClient || isLoading}
                className="text-white bg-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer text-xs sm:text-sm px-3 sm:px-4"
              >
                Dashboard
              </Button>
            </div>
          )}

          {pathname === "/dashboard" && <DashBoardNav />}

          {pathname === "/history" && <HistoryNav />}
        </div>
      </nav>
    </header>
  );
};
export default Navbar;

"use client";

import React from "react";
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

  // Hide navbar on auth pages
  if (pathname === "/auth/login" || pathname === "/auth/signup" || pathname === "/auth") {
    return null;
  }

  return (
    <header className="mx-auto lg:px-20 px-10 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">PostGenius</span>
        </div>
        {pathname === "/" && (
          <div className="flex items-center space-x-4">
            
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isLoading}
              className="text-white bg-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
            >
              Dashboard
            </Button>
          </div>
        )}

        {pathname === "/dashboard" && <DashBoardNav />}

        {pathname === "/history" && <HistoryNav />}
      </nav>
    </header>
  );
};
export default Navbar;

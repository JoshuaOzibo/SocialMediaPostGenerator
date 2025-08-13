"use client";

import React from "react";
import { Sparkles, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <header className="container mx-auto px-4 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">PostGenius</span>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/history">
                <Button
                  variant="ghost"
                  className="text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  History
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-600">
                  {user?.user_metadata?.full_name || user?.user_metadata?.email || 'User'}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                disabled={isLoading}
                className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

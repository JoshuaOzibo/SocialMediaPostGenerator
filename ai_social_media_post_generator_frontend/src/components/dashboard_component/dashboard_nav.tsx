import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const DashBoardNav = () => {
  const router = useRouter();


  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="w-full flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900 px-2 sm:px-3"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>
        <div className="hidden md:flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-slate-900">
            Dashboard
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <Link href="/history">
          <Button variant="outline" size="sm" className="rounded-xl text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">View History</span>
            <span className="sm:hidden">History</span>
          </Button>
        </Link>

        <Button 
          variant="outline" 
          size="sm"
          className="rounded-xl hover:bg-red-500 hover:text-white text-red-500 px-2 sm:px-3" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default DashBoardNav;

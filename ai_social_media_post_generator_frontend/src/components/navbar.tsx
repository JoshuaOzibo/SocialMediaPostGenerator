import React from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">PostGenius</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
            >
              History
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

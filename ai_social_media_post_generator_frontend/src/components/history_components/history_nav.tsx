import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowLeft, LogOut } from 'lucide-react'
import { Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const HistoryNav = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="container mx-auto bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-slate-900">Post History</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              Create New Posts
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl hover:bg-red-500 hover:text-white text-red-500" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          </div>
        </nav>
      </header> 
  )
}

export default HistoryNav;
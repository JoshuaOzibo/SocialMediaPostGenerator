import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowLeft, LogOut, Calendar, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip'

const HistoryNav = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="w-full flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 px-2 sm:px-3"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Back to Dashboard</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="hidden md:flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-slate-900">Post History</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard">
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 rounded-xl px-2 sm:px-4"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Create New Posts</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Create New Posts</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl hover:bg-red-500 hover:text-white text-red-500 px-2 sm:px-3" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}

export default HistoryNav;
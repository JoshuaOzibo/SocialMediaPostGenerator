import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Calendar } from 'lucide-react'

const HistoryNav = () => {
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
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              Create New Posts
            </Button>
          </Link>
        </nav>
      </header> 
  )
}

export default HistoryNav;
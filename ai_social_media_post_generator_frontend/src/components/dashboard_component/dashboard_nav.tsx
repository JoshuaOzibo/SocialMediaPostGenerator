import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Sparkles } from 'lucide-react'

const DashBoardNav = () => {
  return (
    <header className="container mx-auto px-4 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-semibold text-slate-900">Dashboard</span>
                </div>
              </div>
              <Link href="/history">
                <Button variant="outline" className="rounded-xl">
                  View History
                </Button>
              </Link>
            </nav>
          </header>
  )
}

export default DashBoardNav;
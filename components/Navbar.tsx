'use client'

import ThemeToggle from './ThemeToggle'
import { Star } from 'lucide-react'
import Button from './button'
import { signOut} from "next-auth/react";

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-zinc-700 shadow-black">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div  className="flex items-center space-x-1.5">
            <Star className='text-blue-600'/>
        <h3 className="text-blue-600 text-xl font-semibold">GithubExplorer</h3>
        </div>
        <div className='flex items-center space-x-1'>
            <ThemeToggle />
             <Button onClick={()=> signOut( {callbackUrl : "/signup"}) }>
            Logout
        </Button>
        </div>
      </nav>
    </header>
  )
}

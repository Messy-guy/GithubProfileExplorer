"use client"

import React from 'react'
import { Github } from 'lucide-react'
import Button from '@/components/button'
import { signIn } from 'next-auth/react'
function LoginPage() {
  return (
      <div className='h-screen w-screen flex items-center justify-center bg-white dark:bg-black absolute inset-0 z-10'>
        <div className='w-100 h-80 bg-amber-50 shadow-2xl rounded-4xl flex flex-col space-y-3 items-center justify-center '>
        <div className='mt-5 mx-auto w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700  rounded-2xl flex items-center justify-center'>
          <Github className='w-8 h-8 text-white' />
        </div>
        <h1 className='font-bold text-3xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent '>Welcome</h1>
        <p className='text-slate-600 text-lg'>Sign up to continue to your account</p>
        <Button onClick={()=> signIn("github", {callbackUrl : `${window.location.origin}/home`}) } className='mt-3 px-20 py-3 flex bg-gradient-to-br from-slate-900 to-slate-700 space-x-2'>
          <Github className=' text-white' />
          <p className='text-white'>Continue with Github</p>
        </Button>
        </div>
      </div>
  )
}

export default LoginPage
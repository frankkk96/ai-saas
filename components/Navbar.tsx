"use client"
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './MobileSidebar'

type Props = {
  apiLimitCount: number
}

const Navbar = ({ apiLimitCount }: Props) => {
  return (
    <div className='flex items-center p-4'>
        <MobileSidebar apiLimitCount={apiLimitCount} />
        <div className='flex w-full justify-end'>
          <UserButton afterSignOutUrl='/' />
        </div>
    </div>
  )
}

export default Navbar
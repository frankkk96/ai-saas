"use client"
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './MobileSidebar'

type Props = {
  apiLimitCount: number
  isPro: boolean
}

const Navbar = ({ apiLimitCount, isPro }: Props) => {
  return (
    <div className='flex items-center p-4'>
        <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        <div className='flex w-full justify-end'>
          <UserButton afterSignOutUrl='/' />
        </div>
    </div>
  )
}

export default Navbar
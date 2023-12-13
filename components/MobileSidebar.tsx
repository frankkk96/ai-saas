"use client"
import { Menu } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'

type Props = {}

const MobileSidebar = (props: Props) => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className='md:hidden' >
            <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
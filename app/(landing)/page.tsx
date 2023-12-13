import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        landing page
        <div>
            <Link href='/sign-in'>
                <Button>Sign in</Button>
            </Link>
        </div>
        <div>
            <Link href='/sign-up'>
                <Button>Sign up</Button>
            </Link>
        </div>
    </div>
  )
}

export default page
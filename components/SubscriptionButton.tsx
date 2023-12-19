"use client"

import React from 'react'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import axios from 'axios'

type Props = {
  isPro: boolean
}

const SubscriptionButton = ({ isPro = false }: Props) => {
  const [loading, setLoading] = React.useState(false)

  const onClick = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stripe')
      window.location.href = response.data.url
    } catch (error) {
      console.log(error, 'STRIPE_CLIENT_ERROR')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button disabled={loading} variant={isPro ? "default" : "premium"} onClick={onClick}>
      {isPro ? "Manage Subscription": "Ubgrade"}
      {!isPro && <Zap className='w-4 h-4 ml-2 fill-white'/>}
    </Button>
  )
}

export default SubscriptionButton
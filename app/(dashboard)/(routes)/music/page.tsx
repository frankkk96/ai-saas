"use client"

import * as z from 'zod'
import Heading from '@/components/Heading'
import { MessageSquare, Music } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { formSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Message } from '@/app/api/conversation/route'
import Empty from '@/components/Empty'
import Loader from '@/components/Loader'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar'
import BotAvatar from '@/components/BotAvatar'


type Props = {}

const page = (props: Props) => {
  const router = useRouter()
  const [music , setMusic] = React.useState<string>()
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  })

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined)
      const response = await axios.post('/api/music', values)
      setMusic(response.data.audio)
      form.reset()
    } catch (error) {
      console.log(error)
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        title='Music Generation'
        description='Generate music from a prompt.'
        icon={Music}
        iconColor='text-emerald-500'
        bgColor='bg-emerald-500/10'
      />
      <div className='px-4 lg:px-8'>
       <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='
              rounded-lg
              border
              w-full
              p-4
              px-3
              md:px-6
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            '
          >
            <FormField
              name='prompt'
              render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className='m-0 p-0'>
                    <Input className='border-0 outline-none focus-visible:ring-0 focuse-visible:ring-transparent'
                      disabled={isLoading}
                      placeholder='Pinao Solo'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>
       </div>
       <div className='space-y-4 mt-4'>
         <div className='flex flex-col-reverse gap-y-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader />
            </div>
          )}
           {!music && !isLoading && (
              <Empty label="No music generated." />
           )}
          <div>
            {music && (
              <audio controls className='w-full mt-8'>
                <source src={music} />
              </audio>
            )}
          </div>
         </div>
       </div>
      </div>
    </div>
  )
}

export default page
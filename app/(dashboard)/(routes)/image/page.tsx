"use client"

import * as z from 'zod'
import Heading from '@/components/Heading'
import { Download, MessageSquare } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { amountOptions, formSchema, resolutionOptions } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Empty from '@/components/Empty'
import Loader from '@/components/Loader'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar'
import BotAvatar from '@/components/BotAvatar'
import { imageConfigDefault } from 'next/dist/shared/lib/image-config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardFooter } from '@/components/ui/card'
import Image from 'next/image'


type Props = {}

const page = (props: Props) => {
  const router = useRouter()
  const [images, setImages] = React.useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "1024x1024",
    }
  })

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([])
      // console.log(values)
      const response = await axios.post('/api/image', values)
      const urls = response.data.map((image: { url: string }) => image.url)
      setImages(urls)
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
        title='Conversation'
        description='Chat with AI'
        icon={MessageSquare}
        iconColor='text-violet-500'
        bgColor='bg-violet-500/10'
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
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl className='m-0 p-0'>
                    <Input className='border-0 outline-none focus-visible:ring-0 focuse-visible:ring-transparent'
                      disabled={isLoading}
                      placeholder='A picture of a cat'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              name='amount'
              control={form.control}
              render={({field}) => (
                <FormItem className='col-span-12 lg:col-span-2'>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField 
              name='resolution'
              control={form.control}
              render={({field}) => (
                <FormItem className='col-span-12 lg:col-span-2'>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <div className='p-20'>
              <Loader />
            </div>
          )}
           {images.length === 0 && !isLoading && (
              <Empty label="No images generated." />
           )}
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
            {images.map((src) => (
              <Card
                key={src}
                className='rounded-lg overflow-hidden'
              >
                <div className='relative aspect-square'>
                  <Image
                    alt="Image"
                    fill
                    src={src}
                  />
                </div>
                <CardFooter className='p-2'>
                  <Button 
                    variant="secondary" 
                    className='w-full'
                    onClick={() => window.open(src)}
                  >
                    <Download className='h-4 w-4 mr-2' />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
           </div>
         </div>
       </div>
      </div>
    </div>
  )
}

export default page
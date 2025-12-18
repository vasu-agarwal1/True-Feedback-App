'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import {  useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useCompletion } from '@ai-sdk/react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const specialchar = '||'

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialchar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"



export default function sendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString
  })

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch("content")

  const handleMessageClick = (message : string) =>{
    form.setValue("content", message)
  }

  const[isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-message',{
        ...data,
        username
      })
      toast(response.data.message)
      form.reset({...form.getValues(), content: ""})
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("error", {description: axiosError.response?.data.message || "Failed to send message"})
    }finally{
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      complete('')
    } catch (error) {
      console.error('Error fetching suggested messages:', error)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-gradient-to-b from-blue-50/70 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Send an Anonymous Message
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">to @{username}</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Your message</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Write your anonymous message here..."
                          className="mt-2 min-h-36 w-full rounded-lg border border-input bg-background px-4 py-3 text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading || !messageContent}>
                      Send Message
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4 my-10">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">Need inspiration?</h3>
              <p className="text-sm text-muted-foreground">Click a suggestion to fill the box.</p>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              variant="secondary"
              disabled={isSuggestLoading}
            >
              {isSuggestLoading ? (
                <span className="inline-flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting...</span>
              ) : (
                'Suggest Messages'
              )}
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <h3 className="text-xl font-semibold">Suggestions</h3>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parseStringMessages(completion)
                    .map((m) => m.trim())
                    .filter(Boolean)
                    .map((message, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left whitespace-normal h-auto py-2 px-3 hover:-translate-y-0.5 transition"
                        onClick={() => handleMessageClick(message)}
                      >
                        {message}
                      </Button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />
        <div className="text-center">
          <div className="mb-3 text-base">Get your own anonymous message board</div>
          <Link href={'/sign-up'}>
            <Button className="shadow">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>

  )
}

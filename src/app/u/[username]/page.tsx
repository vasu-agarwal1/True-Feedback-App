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
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
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

  // OPTION 1 UPDATE: Replaced useCompletion with standard React state
  const [suggestedMessages, setSuggestedMessages] = useState(initialMessageString)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch("content")

  const handleMessageClick = (message: string) => {
    form.setValue("content", message)
  }

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-message', {
        ...data,
        username
      })
      toast(response.data.message)
      form.reset({ ...form.getValues(), content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("error", { description: axiosError.response?.data.message || "Failed to send message" })
    } finally {
      setIsLoading(false)
    }
  }

  // OPTION 1 UPDATE: Standard Axios Fetch
  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true)
    setSuggestError(null)
    try {
      const response = await axios.post('/api/suggest-messages')
      // Ensure your backend returns: { result: "Q1||Q2||Q3" }
      setSuggestedMessages(response.data.result)
    } catch (error) {
      console.error('Error fetching suggested messages:', error)
      setSuggestError("Failed to fetch suggestions")
    } finally {
      setIsSuggestLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Send an Anonymous Message
            </span>
          </h1>
          <p className="mt-3 text-lg font-medium text-muted-foreground/80">to <span className="text-blue-600 dark:text-blue-400 font-semibold">@{username}</span></p>
        </div>

        <Card className="shadow-xl border-2 border-blue-100/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="pt-8 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-foreground/90">Your message</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Write your anonymous message here..."
                          className="mt-3 min-h-40 w-full rounded-xl border-2 border-input bg-background/50 px-4 py-3 text-base shadow-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:shadow-md hover:border-blue-300 dark:hover:border-blue-700 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center pt-2">
                  {isLoading ? (
                    <Button disabled className="w-full sm:w-auto px-8 py-6 text-base font-semibold shadow-lg">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isLoading || !messageContent}
                      className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Send Message
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-5 my-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Need inspiration?</h3>
              <p className="text-sm text-muted-foreground/80">Click a suggestion to fill the box.</p>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              variant="secondary"
              disabled={isSuggestLoading}
              className="w-full sm:w-auto px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700"
            >
              {isSuggestLoading ? (
                <span className="inline-flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting...</span>
              ) : (
                'Suggest Messages'
              )}
            </Button>
          </div>

          <Card className="shadow-lg border-2 border-purple-100/50 dark:border-slate-800 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-900/80 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-bold text-foreground/90">💡 Suggestions</h3>
            </CardHeader>
            <CardContent>
              {suggestError ? (
                <p className="text-red-500 font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">{suggestError}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* OPTION 1 UPDATE: Mapping over `suggestedMessages` state instead of `completion` */}
                  {parseStringMessages(suggestedMessages)
                    .map((m) => m.trim())
                    .filter(Boolean)
                    .map((message, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left whitespace-normal h-auto py-3 px-4 hover:-translate-y-1 transition-all duration-200 border-2 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 font-medium"
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

        <Separator className="my-12" />
        <div className="text-center space-y-4 py-6">
          <div className="mb-4 text-lg font-semibold text-foreground/80">Get your own anonymous message board</div>
          <Link href={'/sign-up'}>
            <Button className="px-8 py-6 text-base font-bold shadow-lg hover:shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
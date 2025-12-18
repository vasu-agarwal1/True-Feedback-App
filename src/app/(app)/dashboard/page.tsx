'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, Copy, Check } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const page = () => {
  // this file is the dashboard for the user
  // it shows the messages received by the user
  // and allows the user to toggle the accept messages switch
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDeleteMessage = (message: Message) => {
    setMessages(messages.filter((m) => m._id !== message._id))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async() => {
    setIsSwitchLoading(true)
    try {
      const response =await axios.get('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {description: axiosError.response?.data.message || "Failed to fetch message settings"})
    } 
    finally{
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback( async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh) toast("Refreshed Messages", {description: "Showing latest messages"})
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {description: axiosError.response?.data.message || "Failed to fetch message settings"})
    } 
    finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error", {description: axiosError.response?.data.message || "Failed to update message settings"})
    }
  }

  if(!session || !session.user) {
    return <div></div>
  }

  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast("URL Copied", {description: "Your unique profile URL has been copied."})
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast("Copy failed", {description: "Please copy the link manually."})
    }
  }


    return (
    <div className="min-h-[calc(100dvh-80px)] bg-gradient-to-b from-sky-50/70 to-white dark:from-slate-900 dark:to-slate-950 py-8">
      <div className="mx-4 md:mx-8 lg:mx-auto w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your anonymous messages and sharing link.</p>
        </header>

        <section className="mb-6 rounded-xl border bg-background shadow-sm p-4 md:p-5">
          <h2 className="text-base font-medium mb-3">Your public link</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm text-foreground/90"
            />
            <Button onClick={copyToClipboard} variant={copied ? "secondary" : "default"} className="shrink-0">
              {copied ? (<span className="inline-flex items-center"><Check className="mr-2 h-4 w-4"/>Copied</span>) : (<span className="inline-flex items-center"><Copy className="mr-2 h-4 w-4"/>Copy</span>)}
            </Button>
          </div>
        </section>

        <section className="mb-6 rounded-xl border bg-background shadow-sm p-4 md:p-5 flex items-center justify-between">
          <div>
            <p className="text-base font-medium">Accept new messages</p>
            <p className="text-sm text-muted-foreground">Turn off to stop receiving new messages.</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-sm text-muted-foreground">{acceptMessages ? 'On' : 'Off'}</span>
          </div>
        </section>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Messages {messages.length ? `(${messages.length})` : ''}</h2>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <span className="inline-flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Refreshing</span>
            ) : (
              <span className="inline-flex items-center"><RefreshCcw className="mr-2 h-4 w-4" />Refresh</span>
            )}
          </Button>
        </div>
        <Separator />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full rounded-xl border bg-background p-8 text-center">
              <p className="text-base font-medium">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">Share your public link to start receiving messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
  
}

export default page

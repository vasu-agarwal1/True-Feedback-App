'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="relative min-h-[calc(100dvh-56px)] flex flex-col items-center justify-center px-4 md:px-8 py-16 overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/30 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-[-8rem] right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950/90" />
        </div>

        {/* Hero */}
        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Dive into Anonymous Feedback
            </span>
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Truth Bombs — share thoughts freely while your identity stays private.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button className="shadow">Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2400 })]}
          className="w-full max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-3">
                <Card className="border border-white/10 bg-white/5 backdrop-blur shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-white/90">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-300" />
                    <div>
                      <p className="text-white/90">{message.content}</p>
                      <p className="mt-1 text-xs text-white/60">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 flex items-center justify-center gap-2">
            <CarouselPrevious className="relative" />
            <CarouselNext className="relative" />
          </div>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 border-t border-white/10 bg-slate-800/60 dark:bg-slate-800/40 backdrop-blur">
        <p className="text-sm text-slate-200/80">© 2025 Truth Bombs. All rights reserved.</p>
      </footer>
    </>
  );
}
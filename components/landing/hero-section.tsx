'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Trophy, Users } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(66,153,225,0.1),rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" />
            <span>Golf with purpose</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Every swing
            <span className="relative mx-2 inline-block text-primary">
              supports
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 4 150 4 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            a cause
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Join a community of golfers making a difference. Subscribe, play, log your scores,
            and watch your passion for golf transform into real charitable impact.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/sign-up">
                Start Your Impact
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-border pt-10 md:gap-16">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground md:text-4xl">
                <Users className="h-7 w-7 text-primary" />
                2,500+
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Active Members</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground md:text-4xl">
                <Heart className="h-7 w-7 text-accent" />
                $125K+
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Donated to Charity</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground md:text-4xl">
                <Trophy className="h-7 w-7 text-chart-4" />
                500+
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Rewards Given</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

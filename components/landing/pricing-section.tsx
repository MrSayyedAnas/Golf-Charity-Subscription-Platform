import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/products'
import { cn } from '@/lib/utils'

export function PricingSection() {
  return (
    <section id="pricing" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Choose Your Impact Level
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Every plan supports charity. Higher tiers mean more donations, more draw entries, and more rewards.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col transition-all hover:shadow-lg',
                plan.popular && 'border-primary shadow-md'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold">${(plan.priceInCents / 100).toFixed(2)}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>

                <div className="mb-4 flex items-center justify-center gap-4 rounded-lg bg-muted/50 p-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{plan.drawEntries}</div>
                    <div className="text-xs text-muted-foreground">Draw Entries</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">{plan.charityAllocation}%</div>
                    <div className="text-xs text-muted-foreground">To Charity</div>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={`/auth/sign-up?plan=${plan.id}`}>
                    Get Started
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  )
}

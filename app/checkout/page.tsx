import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SUBSCRIPTION_PLANS } from '@/lib/products'
import { Checkout } from '@/components/checkout'
import { Check } from 'lucide-react'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const planId = params.plan || 'premium-monthly'
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)

  if (!plan) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Complete Your Subscription</h1>
            <p className="text-muted-foreground">
              You&apos;re subscribing to the {plan.name} plan
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Plan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{plan.name} Plan</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ${(plan.priceInCents / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{plan.drawEntries}</p>
                      <p className="text-sm text-muted-foreground">Draw Entries</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">{plan.charityAllocation}%</p>
                      <p className="text-sm text-muted-foreground">To Charity</p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Secure checkout powered by Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                <Checkout productId={plan.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

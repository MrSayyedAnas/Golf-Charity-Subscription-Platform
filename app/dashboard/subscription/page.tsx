import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/products'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing.</p>
      </div>

      {subscription ? (
        <>
          {/* Current Plan */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {subscription.subscription_plans?.name} Plan
                  </CardTitle>
                  <CardDescription>Your current subscription</CardDescription>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border p-4">
                  <CreditCard className="mb-2 h-5 w-5 text-muted-foreground" />
                  <p className="text-2xl font-bold">
                    ${(subscription.subscription_plans?.price || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <Calendar className="mb-2 h-5 w-5 text-muted-foreground" />
                  <p className="text-lg font-semibold">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Next billing date</p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="mb-2 text-sm text-muted-foreground">Features</p>
                  <p className="font-semibold">
                    {subscription.subscription_plans?.draw_entries} draw entries
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.subscription_plans?.charity_percentage}% to charity
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Options */}
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Impact</CardTitle>
              <CardDescription>
                Unlock more draw entries and increase your charitable contribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {SUBSCRIPTION_PLANS.filter(
                  (plan) => plan.priceInCents > (subscription.subscription_plans?.price || 0) * 100
                ).map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-lg border border-border p-4 transition-colors hover:border-primary"
                  >
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="mb-3 text-2xl font-bold">
                      ${(plan.priceInCents / 100).toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                    <ul className="mb-4 space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {plan.drawEntries} draw entries
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {plan.charityAllocation}% to charity
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      Upgrade
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Plan</CardTitle>
            <CardDescription>
              Subscribe to start logging scores, entering draws, and supporting charities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-4 ${
                    plan.popular ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="mb-2">Most Popular</Badge>
                  )}
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mb-3 text-2xl font-bold">
                    ${(plan.priceInCents / 100).toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="mb-4 space-y-1 text-sm">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={`/checkout?plan=${plan.id}`}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

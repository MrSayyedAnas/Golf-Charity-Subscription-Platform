'use server'

import { stripe } from '@/lib/stripe'
import { SUBSCRIPTION_PLANS } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function startCheckoutSession(productId: string, userId?: string) {
  const product = SUBSCRIPTION_PLANS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name} Subscription`,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: product.interval,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    metadata: {
      userId: userId || '',
      planId: productId,
    },
  })

  return session.client_secret
}

export async function createSubscription(userId: string, planId: string, stripeSubscriptionId: string) {
  const supabase = await createClient()
  
  // Get the plan details
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('stripe_price_id', planId)
    .single()

  if (!plan) {
    throw new Error('Plan not found')
  }

  // Create subscription record
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: plan.id,
      status: 'active',
      stripe_subscription_id: stripeSubscriptionId,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  // Create default charity allocation
  const { data: defaultCharity } = await supabase
    .from('charities')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .single()

  if (defaultCharity) {
    await supabase
      .from('charity_allocations')
      .insert({
        user_id: userId,
        charity_id: defaultCharity.id,
        percentage: 100,
      })
  }

  return subscription
}

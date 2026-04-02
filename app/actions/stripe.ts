import { stripe } from '@/lib/stripe'
import { SUBSCRIPTION_PLANS } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

// ✅ START CHECKOUT SESSION
export async function startCheckoutSession(productId: string, userId: string) {
  const product = SUBSCRIPTION_PLANS.find((p) => p.id === productId)

  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],

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
            interval: product.interval, // 'month' | 'year'
          },
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,

    metadata: {
      userId,
      planId: productId,
    },
  })

  return session.url!
}

// ✅ CREATE SUBSCRIPTION (CALLED FROM WEBHOOK)
export async function createSubscription(
  userId: string,
  planId: string,
  stripeSubscriptionId: string
) {
  const supabase = await createClient()

  // ✅ Get plan
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    console.error('❌ Plan fetch error:', planError)
    throw new Error('Plan not found')
  }

  // ✅ Prevent duplicate subscriptions (FIXED)
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle() // ✅ IMPORTANT FIX

  if (existing) {
    console.log('⚠️ User already has active subscription')
    return existing
  }

  // ✅ Calculate billing period
  const now = new Date()
  const endDate = new Date()

  if (plan.interval === 'year') {
    endDate.setFullYear(now.getFullYear() + 1)
  } else {
    endDate.setMonth(now.getMonth() + 1)
  }

  // ✅ Insert subscription
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: plan.id,
      status: 'active',
      stripe_subscription_id: stripeSubscriptionId,
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Subscription insert error:', error)
    throw error
  }

  // ✅ Assign default charity
  const { data: defaultCharity } = await supabase
    .from('charities')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (defaultCharity) {
    await supabase.from('charity_allocations').insert({
      user_id: userId,
      charity_id: defaultCharity.id,
      percentage: 10,
    })
  }

  return subscription
}
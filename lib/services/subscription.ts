import { supabaseAdmin } from '@/lib/supabase/admin'


// ✅ CREATE SUBSCRIPTION (called from Stripe webhook)
export async function createSubscription(
  userId: string,
  planId: string,
  stripeSubscriptionId: string
) {
  const supabase = supabaseAdmin

  // 🔍 1. Get plan details
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    console.error('❌ Plan fetch error:', planError)
    throw new Error('Plan not found')
  }

  // 🔍 2. Check if user already has active subscription
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle() // ✅ prevents crash if none found

  if (existing) {
    console.log('⚠️ User already has an active subscription')
    return existing
  }

  // 📅 3. Calculate subscription period
  const now = new Date()
  const endDate = new Date()

  if (plan.interval === 'year') {
    endDate.setFullYear(now.getFullYear() + 1)
  } else {
    endDate.setMonth(now.getMonth() + 1)
  }

  // 💾 4. Insert subscription into DB
  const { data: subscription, error: insertError } = await supabase
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

  if (insertError) {
    console.error('❌ Subscription insert error:', insertError)
    throw insertError
  }

  console.log('✅ Subscription created:', subscription.id)

  // ❤️ 5. Assign default charity (optional but recommended)
  const { data: defaultCharity } = await supabase
    .from('charities')
    .select('id')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (defaultCharity) {
    const { error: charityError } = await supabase
      .from('charity_allocations')
      .insert({
        user_id: userId,
        charity_id: defaultCharity.id,
        percentage: 10, // default allocation %
      })

    if (charityError) {
      console.error('⚠️ Charity allocation failed:', charityError)
    } else {
      console.log('❤️ Default charity assigned')
    }
  }

  return subscription
}
import { stripe } from '@/lib/stripe'
import { createSubscription } from '@/lib/services/subscription'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  // ❌ Invalid request → return 400
  if (!sig) {
    console.error('❌ Missing stripe signature')
    return new Response('Missing signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('❌ Signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // ✅ Ensure subscription mode
        if (session.mode !== 'subscription') break

        const userId = session.metadata?.userId
        const planId = session.metadata?.planId
        const stripeSubscriptionId = session.subscription as string | null

        if (!userId || !planId || !stripeSubscriptionId) {
          console.error('❌ Missing metadata:', session)
          break
        }

        console.log('✅ Checkout completed:', {
          userId,
          planId,
          stripeSubscriptionId,
        })

        try {
          await createSubscription(userId, planId, stripeSubscriptionId)
        } catch (err) {
          console.error('❌ createSubscription failed:', err)
          // ❗ Don't throw → prevents infinite retries
        }

        break
      }

      case 'invoice.payment_succeeded':
        console.log('💰 Payment succeeded')
        break

      case 'customer.subscription.created':
        console.log('📦 Subscription created')
        break

      default:
        console.log(`ℹ️ Unhandled event: ${event.type}`)
    }
  } catch (err) {
    console.error('❌ Webhook handler error:', err)
    return new Response('Webhook handler failed', { status: 500 })
  }

  // ✅ Only valid requests reach here
  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
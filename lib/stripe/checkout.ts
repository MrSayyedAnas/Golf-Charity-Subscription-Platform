import { getStripe } from '@/lib/stripe'

export async function startCheckoutSession(
  productId: string,
  userId: string,
  email: string
) {
  try {
    const stripe = getStripe()

    // ✅ Validate inputs
    if (!productId || !userId || !email) {
      throw new Error('Missing required parameters')
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    if (!baseUrl) {
      throw new Error('Missing NEXT_PUBLIC_BASE_URL')
    }

    // ⚠️ productId MUST be a Stripe PRICE ID (price_xxx)
    if (!productId.startsWith('price_')) {
      throw new Error('Invalid Stripe price ID')
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      ui_mode: 'embedded',

      line_items: [
        {
          price: productId,
          quantity: 1,
        },
      ],

      customer_email: email,

      return_url: `${baseUrl}/success`,

      metadata: {
        productId,
        userId,
        planId: productId,
      },

      subscription_data: {
        metadata: {
          userId,
          planId: productId,
        },
      },
    })

    if (!session.client_secret) {
      throw new Error('No client secret returned from Stripe')
    }

    return session.client_secret
  } catch (error: any) {
    console.error('❌ Stripe session error FULL:', error)

    throw new Error(
      error?.message || 'Stripe session creation failed'
    )
  }
}
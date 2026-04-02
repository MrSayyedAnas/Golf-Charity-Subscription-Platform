import { stripe } from '@/lib/stripe'

export async function startCheckoutSession(
  productId: string,
  userId: string,
  email: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',

      // ✅ required for Embedded Checkout
      ui_mode: 'embedded',

      line_items: [
        {
          price: productId, // ✅ dynamic price from frontend
          quantity: 1,
        },
      ],

      // ✅ real user email
      customer_email: email,

      // ✅ must be full URL (you already fixed env)
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,

      // ✅ used in webhook
      metadata: {
        productId,
        userId,
        planId: productId,
      },

      // ✅ ensures metadata exists on subscription events
      subscription_data: {
        metadata: {
          userId,
          planId: productId,
        },
      },
    })

    if (!session.client_secret) {
      throw new Error('No client secret returned')
    }

    return session.client_secret
  } catch (error: any) {
    console.error('❌ Stripe session error FULL:', error)
    throw new Error(error.message || 'Stripe session failed')
  }
}
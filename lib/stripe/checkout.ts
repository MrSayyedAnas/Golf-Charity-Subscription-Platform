import { getStripe } from '@/lib/stripe'

export async function startCheckoutSession(
  productId: string,
  userId: string,
  email: string
) {
  try {
    const stripe = getStripe() // ✅ initialize here

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

      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,

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
      throw new Error('No client secret returned')
    }

    return session.client_secret
  } catch (error: any) {
    console.error('❌ Stripe session error FULL:', error)
    throw new Error(error.message || 'Stripe session failed')
  }
}
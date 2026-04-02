import { NextResponse } from 'next/server'
import { startCheckoutSession } from '@/lib/stripe/checkout'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { productId, userId, email } = body

    // ✅ Validate input early (VERY important)
    if (!productId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const clientSecret = await startCheckoutSession(
      productId,
      userId,
      email
    )

    // ✅ Ensure Stripe actually returned something
    if (!clientSecret) {
      throw new Error('No client secret returned from Stripe')
    }

    return NextResponse.json({ clientSecret })
  } catch (error: any) {
    console.error('❌ REAL STRIPE ERROR:', error)

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Something went wrong while creating checkout session',
      },
      { status: 500 }
    )
  }
}
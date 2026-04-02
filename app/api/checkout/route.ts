import { NextResponse } from 'next/server'
import { startCheckoutSession } from '@/lib/stripe/checkout'

export async function POST(req: Request) {
  try {
    const { productId, userId, email } = await req.json()

    const clientSecret = await startCheckoutSession(
      productId,
      userId,
      email
    )

    return NextResponse.json({ clientSecret })
  } catch (error: any) {
    console.error('❌ REAL STRIPE ERROR:', error)

    return NextResponse.json(
      {
        error: error.message || 'Something went wrong',
      },
      { status: 500 }
    )
  }
}
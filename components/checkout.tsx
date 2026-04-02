"use client"

import { useCallback, useEffect, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createClient } from '@/lib/supabase/client'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export function Checkout({ productId }: { productId: string }) {
  const [user, setUser] = useState<any>(null)

  // ✅ Get logged-in user
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const fetchClientSecret = useCallback(async () => {
    if (!user) throw new Error('User not loaded')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,      // ✅ real user id
          email: user.email,    // ✅ real email
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('❌ API ERROR:', data)
        throw new Error(data.error || 'API request failed')
      }

      if (!data.clientSecret) {
        console.error('❌ Missing clientSecret:', data)
        throw new Error('No clientSecret returned')
      }

      return data.clientSecret
    } catch (err) {
      console.error('❌ Checkout error:', err)
      throw err
    }
  }, [productId, user])

  // ✅ Prevent rendering before user is ready
  if (!user) {
    return <p>Loading checkout...</p>
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
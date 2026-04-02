"use client"

import { useCallback, useEffect, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createClient } from '@/lib/supabase/client'

// ✅ Validate Stripe key properly
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripeKey) {
  throw new Error('Missing Stripe publishable key')
}

const stripePromise = loadStripe(stripeKey)

export function Checkout({ productId }: { productId: string }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Auth error:', error)
          setUser(null)
        } else {
          setUser(data?.user ?? null)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const fetchClientSecret = useCallback(async () => {
    if (!user) throw new Error('User not loaded')

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        userId: user.id,
        email: user.email,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.clientSecret) {
      throw new Error(data.error || 'Checkout failed')
    }

    return data.clientSecret
  }, [productId, user])

  // ✅ Proper UI states (prevents blank screen)
  if (loading) return <p>Loading checkout...</p>
  if (!user) return <p>Please log in to continue</p>

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
export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: 'month' | 'year'
  features: string[]
  drawEntries: number
  charityAllocation: number
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: Product[] = [
  {
    id: 'basic-monthly',
    name: 'Basic',
    description: 'Perfect for casual golfers who want to give back',
    priceInCents: 999, // $9.99/month
    interval: 'month',
    features: [
      'Log unlimited scores',
      '1 monthly draw entry',
      '5% to charity of choice',
      'Basic leaderboard access',
      'Community access',
    ],
    drawEntries: 1,
    charityAllocation: 5,
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    description: 'For dedicated golfers who want more impact',
    priceInCents: 2499, // $24.99/month
    interval: 'month',
    features: [
      'Everything in Basic',
      '3 monthly draw entries',
      '10% to charity of choice',
      'Advanced stats & analytics',
      'Priority reward fulfillment',
      'Exclusive member events',
    ],
    drawEntries: 3,
    charityAllocation: 10,
    popular: true,
  },
  {
    id: 'elite-monthly',
    name: 'Elite',
    description: 'Maximum impact for serious golfers',
    priceInCents: 4999, // $49.99/month
    interval: 'month',
    features: [
      'Everything in Premium',
      '5 monthly draw entries',
      '15% to charity of choice',
      'VIP charity experiences',
      'Personal impact dashboard',
      'Direct charity connections',
      'Early access to new features',
    ],
    drawEntries: 5,
    charityAllocation: 15,
  },
]

// Alias for the checkout component compatibility
export const PRODUCTS = SUBSCRIPTION_PLANS

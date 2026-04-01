import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CharitiesSection } from '@/components/landing/charities-section'
import { ImpactSection } from '@/components/landing/impact-section'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user ? { email: user.email || '' } : null} />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <PricingSection />
        <CharitiesSection />
        <ImpactSection />
      </main>
      <Footer />
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar 
        user={{
          id: user.id,
          email: user.email || '',
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
        }}
        subscription={subscription}
      />
      <main className="flex-1 overflow-auto bg-muted/30">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

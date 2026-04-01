import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin (using user metadata)
  const isAdmin = user.user_metadata?.is_admin === true

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar 
        user={{
          email: user.email || '',
        }}
      />
      <main className="flex-1 overflow-auto bg-muted/30">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

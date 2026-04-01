'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Heart,
  Gift,
  Trophy,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'
import { useState } from 'react'

interface AdminSidebarProps {
  user: {
    email: string
  }
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/charities', label: 'Charities', icon: Heart },
  { href: '/admin/draws', label: 'Draws', icon: Gift },
  { href: '/admin/rewards', label: 'Rewards', icon: Trophy },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
            <span className="text-lg font-bold text-destructive-foreground">A</span>
          </div>
          <div>
            <span className="text-lg font-semibold">Admin Panel</span>
            <p className="text-xs text-muted-foreground">Birdie for Good</p>
          </div>
        </Link>
      </div>

      {/* Back to Dashboard */}
      <div className="border-b border-border px-4 pb-4">
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* User Info */}
      <div className="border-b border-border px-4 py-4">
        <div className="rounded-lg bg-destructive/10 p-3">
          <p className="text-xs font-medium text-destructive">ADMIN</p>
          <p className="text-sm">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-destructive text-destructive-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-md md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-background">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-background md:flex">
        {sidebarContent}
      </aside>
    </>
  )
}

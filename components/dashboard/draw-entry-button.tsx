'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Ticket } from 'lucide-react'

interface DrawEntryButtonProps {
  drawId: string
  userId: string
  canEnter: boolean
  reason?: string
}

export function DrawEntryButton({ drawId, userId, canEnter, reason }: DrawEntryButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleEnter() {
    if (!canEnter) return
    setLoading(true)

    const { error } = await supabase.from('draw_entries').insert({
      draw_id: drawId,
      user_id: userId,
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('You have already entered this draw')
      } else {
        toast.error('Failed to enter draw')
      }
      setLoading(false)
      return
    }

    toast.success('Successfully entered the draw!')
    setLoading(false)
    router.refresh()
  }

  if (!canEnter) {
    return (
      <Button variant="outline" className="w-full" disabled>
        {reason || 'Cannot Enter'}
      </Button>
    )
  }

  return (
    <Button onClick={handleEnter} className="w-full gap-2" disabled={loading}>
      {loading ? <Spinner /> : <Ticket className="h-4 w-4" />}
      Enter Draw
    </Button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trophy } from 'lucide-react'

interface RunDrawButtonProps {
  drawId: string
  drawName: string
}

export function RunDrawButton({ drawId, drawName }: RunDrawButtonProps) {
  const [loading, setLoading] = useState(false)
  const [winner, setWinner] = useState<{ firstName: string; lastName: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleRunDraw() {
    setLoading(true)

    // Get all entries for this draw
    const { data: entries, error: entriesError } = await supabase
      .from('draw_entries')
      .select('user_id')
      .eq('draw_id', drawId)

    if (entriesError || !entries || entries.length === 0) {
      toast.error('No entries found for this draw')
      setLoading(false)
      return
    }

    // Pick a random winner
    const randomIndex = Math.floor(Math.random() * entries.length)
    const winnerId = entries[randomIndex].user_id

    // Get winner details
    const { data: winnerProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', winnerId)
      .single()

    // Get the draw's reward
    const { data: draw } = await supabase
      .from('draws')
      .select('reward_id')
      .eq('id', drawId)
      .single()

    // Update draw status
    const { error: updateError } = await supabase
      .from('draws')
      .update({
        status: 'completed',
        winner_id: winnerId,
        drawn_at: new Date().toISOString(),
      })
      .eq('id', drawId)

    if (updateError) {
      toast.error('Failed to complete draw')
      setLoading(false)
      return
    }

    // Create user reward
    if (draw?.reward_id) {
      await supabase.from('user_rewards').insert({
        user_id: winnerId,
        reward_id: draw.reward_id,
        draw_id: drawId,
        status: 'pending',
      })
    }

    setWinner({
      firstName: winnerProfile?.first_name || 'Unknown',
      lastName: winnerProfile?.last_name || 'User',
    })
    
    toast.success(`Winner selected: ${winnerProfile?.first_name} ${winnerProfile?.last_name}`)
    setLoading(false)
    router.refresh()
  }

  if (winner) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm">
        <Trophy className="h-4 w-4 text-primary" />
        <span>
          Winner: <strong>{winner.firstName} {winner.lastName}</strong>
        </span>
      </div>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Trophy className="h-4 w-4" />
          Run Draw
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run Draw: {drawName}</AlertDialogTitle>
          <AlertDialogDescription>
            This will randomly select a winner from all entries and mark the draw as complete. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRunDraw} disabled={loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            Select Winner
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

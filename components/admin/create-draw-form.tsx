'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface Reward {
  id: string
  name: string
  value: number
}

interface CreateDrawFormProps {
  rewards: Reward[]
}

export function CreateDrawForm({ rewards }: CreateDrawFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rewardId, setRewardId] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('draws').insert({
      name,
      description,
      reward_id: rewardId,
      start_date: new Date().toISOString(),
      end_date: new Date(endDate).toISOString(),
      status: 'active',
    })

    if (error) {
      toast.error('Failed to create draw')
      setLoading(false)
      return
    }

    toast.success('Draw created successfully!')
    setName('')
    setDescription('')
    setRewardId('')
    setEndDate('')
    setLoading(false)
    router.refresh()
  }

  // Set minimum date to tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Draw Name</Label>
        <Input
          id="name"
          placeholder="e.g., January 2025 Draw"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter draw description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward">Reward</Label>
        <Select value={rewardId} onValueChange={setRewardId} required>
          <SelectTrigger id="reward">
            <SelectValue placeholder="Select a reward" />
          </SelectTrigger>
          <SelectContent>
            {rewards.map((reward) => (
              <SelectItem key={reward.id} value={reward.id}>
                {reward.name} (${reward.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={minDate.toISOString().split('T')[0]}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner className="mr-2" /> : null}
        Create Draw
      </Button>
    </form>
  )
}

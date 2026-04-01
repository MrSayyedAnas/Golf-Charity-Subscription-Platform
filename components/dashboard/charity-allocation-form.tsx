'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

interface Charity {
  id: string
  name: string
}

interface Allocation {
  id: string
  charity_id: string
  percentage: number
  charities: Charity
}

interface CharityAllocationFormProps {
  userId: string
  charities: Charity[]
  currentAllocations: Allocation[]
}

export function CharityAllocationForm({ userId, charities, currentAllocations }: CharityAllocationFormProps) {
  const [allocations, setAllocations] = useState<{ charityId: string; percentage: number }[]>(
    currentAllocations.length > 0 
      ? currentAllocations.map(a => ({ charityId: a.charity_id, percentage: a.percentage }))
      : [{ charityId: '', percentage: 100 }]
  )
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0)
  const isValid = totalPercentage === 100 && allocations.every(a => a.charityId !== '')

  function handleAddCharity() {
    if (allocations.length >= charities.length) return
    setAllocations([...allocations, { charityId: '', percentage: 0 }])
  }

  function handleRemoveCharity(index: number) {
    if (allocations.length <= 1) return
    const newAllocations = allocations.filter((_, i) => i !== index)
    setAllocations(newAllocations)
  }

  function handleCharityChange(index: number, charityId: string) {
    const newAllocations = [...allocations]
    newAllocations[index].charityId = charityId
    setAllocations(newAllocations)
  }

  function handlePercentageChange(index: number, percentage: number) {
    const newAllocations = [...allocations]
    newAllocations[index].percentage = percentage
    setAllocations(newAllocations)
  }

  async function handleSave() {
    if (!isValid) return
    setLoading(true)

    // Delete existing allocations
    await supabase
      .from('charity_allocations')
      .delete()
      .eq('user_id', userId)

    // Insert new allocations
    const { error } = await supabase
      .from('charity_allocations')
      .insert(
        allocations.map(a => ({
          user_id: userId,
          charity_id: a.charityId,
          percentage: a.percentage,
        }))
      )

    if (error) {
      toast.error('Failed to save allocations')
      setLoading(false)
      return
    }

    toast.success('Charity allocations saved!')
    setLoading(false)
    router.refresh()
  }

  const usedCharityIds = allocations.map(a => a.charityId).filter(id => id !== '')

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {allocations.map((allocation, index) => (
          <div key={index} className="rounded-lg border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <Select
                value={allocation.charityId}
                onValueChange={(value) => handleCharityChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a charity" />
                </SelectTrigger>
                <SelectContent>
                  {charities
                    .filter(c => !usedCharityIds.includes(c.id) || c.id === allocation.charityId)
                    .map((charity) => (
                      <SelectItem key={charity.id} value={charity.id}>
                        {charity.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {allocations.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 shrink-0"
                  onClick={() => handleRemoveCharity(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Allocation</span>
                <span className="font-semibold">{allocation.percentage}%</span>
              </div>
              <Slider
                value={[allocation.percentage]}
                onValueChange={([value]) => handlePercentageChange(index, value)}
                max={100}
                step={5}
              />
            </div>
          </div>
        ))}
      </div>

      {allocations.length < charities.length && (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleAddCharity}
        >
          <Plus className="h-4 w-4" />
          Add Another Charity
        </Button>
      )}

      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Allocation</span>
          <span className={`font-bold ${totalPercentage === 100 ? 'text-primary' : 'text-destructive'}`}>
            {totalPercentage}%
          </span>
        </div>
        {totalPercentage !== 100 && (
          <p className="mt-1 text-sm text-destructive">
            Allocations must total exactly 100%
          </p>
        )}
      </div>

      <Button 
        onClick={handleSave} 
        className="w-full" 
        disabled={!isValid || loading}
      >
        {loading ? <Spinner className="mr-2" /> : null}
        Save Allocations
      </Button>
    </div>
  )
}

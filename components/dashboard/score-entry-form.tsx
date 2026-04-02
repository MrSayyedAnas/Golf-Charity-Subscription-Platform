'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface ScoreEntryFormProps {
  userId: string
}

export function ScoreEntryForm({ userId }: ScoreEntryFormProps) {
  const [courseName, setCourseName] = useState('')
  const [totalScore, setTotalScore] = useState('')
  const [coursePar, setCoursePar] = useState('72')
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const score = parseInt(totalScore)

    // ✅ STEP 1: Get existing scores (use correct column)
    const { data: existingScores, error: fetchError } = await supabase
      .from('scores')
      .select('id, date_played')
      .eq('user_id', userId)
      .order('date_played', { ascending: true })

    if (fetchError) {
      console.error(fetchError)
      toast.error('Error checking previous scores')
      setLoading(false)
      return
    }

    // ✅ STEP 2: Keep max 5 scores
    if (existingScores && existingScores.length >= 5) {
      const oldestScore = existingScores[0]

      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .eq('id', oldestScore.id)

      if (deleteError) {
        console.error(deleteError)
        toast.error('Failed to update score history')
        setLoading(false)
        return
      }
    }

    // ✅ STEP 3: Insert new score (use correct DB fields)
    const { error } = await supabase.from('scores').insert({
      user_id: userId,
      course_name: courseName,
      gross_score: score,        // ✅ HERE
      date_played: playedAt,     // ✅ HERE
    })

    if (error) {
      console.error(error)
      toast.error('Failed to save score')
      setLoading(false)
      return
    }

    toast.success('Score logged successfully!')

    // Reset form
    setCourseName('')
    setTotalScore('')
    setLoading(false)

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Name</Label>
        <Input
          id="courseName"
          placeholder="e.g., Pebble Beach Golf Links"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="totalScore">Total Score</Label>
          <Input
            id="totalScore"
            type="number"
            placeholder="e.g., 85"
            value={totalScore}
            onChange={(e) => setTotalScore(e.target.value)}
            min={50}
            max={150}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coursePar">Course Par</Label>
          <Select value={coursePar} onValueChange={setCoursePar}>
            <SelectTrigger id="coursePar">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="70">70</SelectItem>
              <SelectItem value="71">71</SelectItem>
              <SelectItem value="72">72</SelectItem>
              <SelectItem value="73">73</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="playedAt">Date Played</Label>
        <Input
          id="playedAt"
          type="date"
          value={playedAt}
          onChange={(e) => setPlayedAt(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner className="mr-2" /> : null}
        Log Score
      </Button>
    </form>
  )
}
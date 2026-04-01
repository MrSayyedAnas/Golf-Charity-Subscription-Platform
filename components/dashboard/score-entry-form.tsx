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
  const [courseRating, setCourseRating] = useState('')
  const [slopeRating, setSlopeRating] = useState('')
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Calculate handicap differential
    const score = parseInt(totalScore)
    const rating = parseFloat(courseRating) || 72
    const slope = parseFloat(slopeRating) || 113
    const handicapDifferential = ((score - rating) * 113) / slope

    const { error } = await supabase.from('scores').insert({
      user_id: userId,
      course_name: courseName,
      total_score: score,
      course_par: parseInt(coursePar),
      course_rating: rating,
      slope_rating: slope,
      handicap_differential: Math.round(handicapDifferential * 10) / 10,
      played_at: playedAt,
    })

    if (error) {
      toast.error('Failed to save score')
      setLoading(false)
      return
    }

    toast.success('Score logged successfully!')
    setCourseName('')
    setTotalScore('')
    setCourseRating('')
    setSlopeRating('')
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
              <SelectValue placeholder="Select par" />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="courseRating">Course Rating (optional)</Label>
          <Input
            id="courseRating"
            type="number"
            step="0.1"
            placeholder="e.g., 72.5"
            value={courseRating}
            onChange={(e) => setCourseRating(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slopeRating">Slope Rating (optional)</Label>
          <Input
            id="slopeRating"
            type="number"
            placeholder="e.g., 131"
            value={slopeRating}
            onChange={(e) => setSlopeRating(e.target.value)}
            min={55}
            max={155}
          />
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

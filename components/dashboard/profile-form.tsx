'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface ProfileFormProps {
  userId: string
  initialData: {
    firstName: string
    lastName: string
    handicapIndex: string
    homeCourse: string
  }
}

export function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(initialData.firstName)
  const [lastName, setLastName] = useState(initialData.lastName)
  const [handicapIndex, setHandicapIndex] = useState(initialData.handicapIndex)
  const [homeCourse, setHomeCourse] = useState(initialData.homeCourse)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        handicap_index: handicapIndex ? parseFloat(handicapIndex) : null,
        home_course: homeCourse || null,
      })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to update profile')
      setLoading(false)
      return
    }

    toast.success('Profile updated successfully!')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="handicapIndex">Handicap Index (optional)</Label>
          <Input
            id="handicapIndex"
            type="number"
            step="0.1"
            min="-10"
            max="54"
            placeholder="e.g., 15.4"
            value={handicapIndex}
            onChange={(e) => setHandicapIndex(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="homeCourse">Home Course (optional)</Label>
          <Input
            id="homeCourse"
            placeholder="e.g., Pebble Beach"
            value={homeCourse}
            onChange={(e) => setHomeCourse(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? <Spinner className="mr-2" /> : null}
        Save Changes
      </Button>
    </form>
  )
}

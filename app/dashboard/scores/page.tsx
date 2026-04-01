import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreEntryForm } from '@/components/dashboard/score-entry-form'
import { ScoreHistory } from '@/components/dashboard/score-history'

export default async function ScoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Scores</h1>
        <p className="text-muted-foreground">Track your rounds and watch your game improve.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Round</CardTitle>
            <CardDescription>Enter your score from a recent round</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreEntryForm userId={user.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score History</CardTitle>
            <CardDescription>Your recent rounds</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreHistory scores={scores || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

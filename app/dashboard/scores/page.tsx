import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScoreEntryForm } from '@/components/dashboard/score-entry-form'
import { ScoreHistory } from '@/components/dashboard/score-history'

export default async function ScoresPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ✅ Better handling
  if (!user) {
    redirect('/auth/login')
  }

  const { data: scores, error } = await supabase
  .from('scores')
  .select('*')
  .eq('user_id', user.id)
  .order('date_played', { ascending: false })   // ✅ primary sort
  .order('created_at', { ascending: false })    // ✅ secondary sort (same-day fix)
  .limit(5) // ✅ only fetch what you need

  // ✅ Better error logging
  if (error) {
    console.error(
      '❌ Error fetching scores:',
      JSON.stringify(error, null, 2)
    )
  }

  const latestScores = scores || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Scores</h1>
        <p className="text-muted-foreground">
          Track your rounds and watch your game improve.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Entry */}
        <Card>
          <CardHeader>
            <CardTitle>New Round</CardTitle>
            <CardDescription>
              Enter your score from a recent round
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreEntryForm userId={user.id} />
          </CardContent>
        </Card>

        {/* Score History */}
        <Card>
          <CardHeader>
            <CardTitle>Score History</CardTitle>
            <CardDescription>Your latest 5 rounds</CardDescription>
          </CardHeader>
          <CardContent>
            {latestScores.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No scores yet. Start by logging your first round!
              </p>
            ) : (
              <ScoreHistory scores={latestScores} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
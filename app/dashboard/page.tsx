import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Target, Trophy, Heart, Gift, TrendingUp, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user stats
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })
    .limit(5)

  const { data: allScores } = await supabase
    .from('scores')
    .select('total_score, handicap_differential')
    .eq('user_id', user.id)

  const { data: charityAllocations } = await supabase
    .from('charity_allocations')
    .select('*, charities(*)')
    .eq('user_id', user.id)

  const { data: userRewards } = await supabase
    .from('user_rewards')
    .select('*, rewards(*)')
    .eq('user_id', user.id)
    .limit(3)

  const totalRounds = allScores?.length || 0
  const averageScore = allScores?.length 
    ? Math.round(allScores.reduce((sum, s) => sum + (s.total_score || 0), 0) / allScores.length) 
    : 0
  const currentHandicap = allScores?.length
    ? (allScores.slice(0, 8).reduce((sum, s) => sum + (s.handicap_differential || 0), 0) / Math.min(8, allScores.length)).toFixed(1)
    : 'N/A'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your golfing impact at a glance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRounds}</p>
              <p className="text-sm text-muted-foreground">Rounds Played</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentHandicap}</p>
              <p className="text-sm text-muted-foreground">Handicap Index</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{charityAllocations?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Charities Supported</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Gift className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userRewards?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Rewards Won</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Scores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Rounds</CardTitle>
              <CardDescription>Your latest scores</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/scores">Log Score</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {scores && scores.length > 0 ? (
              <div className="space-y-3">
                {scores.map((score) => (
                  <div key={score.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{score.course_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(score.played_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{score.total_score}</p>
                      <p className="text-sm text-muted-foreground">
                        {score.total_score - (score.course_par || 72) > 0 ? '+' : ''}
                        {score.total_score - (score.course_par || 72)} ({score.course_par || 72} par)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Target className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No rounds logged yet</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link href="/dashboard/scores">Log Your First Round</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <Link href="/dashboard/scores">
                <Target className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Log a Round</p>
                  <p className="text-sm text-muted-foreground">Record your latest score</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <Link href="/dashboard/charities">
                <Heart className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium">Manage Charities</p>
                  <p className="text-sm text-muted-foreground">Choose where your impact goes</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <Link href="/dashboard/draws">
                <Gift className="h-5 w-5 text-chart-4" />
                <div className="text-left">
                  <p className="font-medium">View Draws</p>
                  <p className="text-sm text-muted-foreground">Check current rewards & entries</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
              <Link href="/dashboard/leaderboard">
                <Trophy className="h-5 w-5 text-chart-4" />
                <div className="text-left">
                  <p className="font-medium">Leaderboard</p>
                  <p className="text-sm text-muted-foreground">See how you rank</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

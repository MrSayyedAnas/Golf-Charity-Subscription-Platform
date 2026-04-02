import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Target,
  Trophy,
  Heart,
  Gift,
  TrendingUp,
} from 'lucide-react'
import { DrawResult } from '@/components/draw-result'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // ✅ FIXED: correct column names
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date_played', { ascending: false })
    .limit(5)

  const { data: allScores } = await supabase
    .from('scores')
    .select('gross_score, handicap_at_time')
    .eq('user_id', user.id)

  const { data: charityAllocations } = await supabase
    .from('charity_allocations')
    .select('*')
    .eq('user_id', user.id)

  const { data: userRewards } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', user.id)
    .limit(3)

  // ✅ Stats
  const totalRounds = allScores?.length || 0

  const averageScore =
    allScores?.length
      ? Math.round(
          allScores.reduce((sum, s) => sum + (s.gross_score || 0), 0) /
            allScores.length
        )
      : 0

  const currentHandicap =
    allScores?.length
      ? (
          allScores.reduce(
            (sum, s) => sum + (s.handicap_at_time || 0),
            0
          ) / allScores.length
        ).toFixed(1)
      : 'N/A'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your golfing impact at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalRounds}</p>
              <p className="text-sm text-muted-foreground">
                Rounds Played
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <TrendingUp className="h-6 w-6 text-chart-2" />
            <div>
              <p className="text-2xl font-bold">
                {currentHandicap}
              </p>
              <p className="text-sm text-muted-foreground">
                Handicap Index
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Heart className="h-6 w-6 text-accent" />
            <div>
              <p className="text-2xl font-bold">
                {charityAllocations?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                Charities Supported
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Gift className="h-6 w-6 text-chart-4" />
            <div>
              <p className="text-2xl font-bold">
                {userRewards?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                Rewards Won
              </p>
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
              <CardDescription>
                Your latest scores
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/scores">
                Log Score
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            {scores && scores.length > 0 ? (
              <div className="space-y-3">
                {scores.map((score) => {
                  const par = 72 // fallback

                  return (
                    <div
                      key={score.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {score.course_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            score.date_played
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {score.gross_score}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {score.gross_score - par > 0 ? '+' : ''}
                          {score.gross_score - par} ({par} par)
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Target className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p>No rounds logged yet</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/scores">
                    Log Your First Round
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3">
            <Button asChild>
              <Link href="/dashboard/scores">
                Log a Round
              </Link>
            </Button>

            <Button asChild>
              <Link href="/dashboard/charities">
                Manage Charities
              </Link>
            </Button>

            <Button asChild>
              <Link href="/dashboard/draws">
                View Draws
              </Link>
            </Button>

            <Button asChild>
              <Link href="/dashboard/leaderboard">
                Leaderboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ✅ DRAW SECTION ADDED */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Draw</CardTitle>
            <CardDescription>
              Run the draw and see winners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrawResult />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
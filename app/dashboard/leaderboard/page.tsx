import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, TrendingUp, Target } from 'lucide-react'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get leaderboard data - top players by various metrics
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*, profiles(first_name, last_name)')
    .order('total_rounds', { ascending: false })
    .limit(20)

  // Calculate user's rank
  const userEntry = leaderboard?.find(entry => entry.user_id === user?.id)
  const userRank = userEntry ? (leaderboard?.indexOf(userEntry) || 0) + 1 : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you stack up against the community.</p>
      </div>

      {userRank && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              #{userRank}
            </div>
            <div>
              <p className="font-semibold">Your Current Ranking</p>
              <p className="text-sm text-muted-foreground">
                Keep playing and logging scores to climb the leaderboard!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="rounds">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="rounds" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Most Rounds</span>
            <span className="sm:hidden">Rounds</span>
          </TabsTrigger>
          <TabsTrigger value="handicap" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Best Handicap</span>
            <span className="sm:hidden">Handicap</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Most Impact</span>
            <span className="sm:hidden">Impact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rounds" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Rounds Played</CardTitle>
              <CardDescription>Players with the most logged rounds</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                data={leaderboard || []} 
                valueKey="total_rounds"
                valueLabel="Rounds"
                currentUserId={user?.id}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handicap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Handicap Index</CardTitle>
              <CardDescription>Players with the lowest handicap</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                data={[...(leaderboard || [])].sort((a, b) => (a.average_handicap || 99) - (b.average_handicap || 99))} 
                valueKey="average_handicap"
                valueLabel="Handicap"
                currentUserId={user?.id}
                lowerIsBetter
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Charitable Impact</CardTitle>
              <CardDescription>Players who have contributed the most</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable 
                data={[...(leaderboard || [])].sort((a, b) => (b.total_charity_contribution || 0) - (a.total_charity_contribution || 0))} 
                valueKey="total_charity_contribution"
                valueLabel="Contributed"
                currentUserId={user?.id}
                formatValue={(v) => `$${(v || 0).toFixed(2)}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface LeaderboardEntry {
  user_id: string
  profiles: { first_name: string; last_name: string } | null
  total_rounds: number
  average_handicap: number | null
  total_charity_contribution: number | null
}

function LeaderboardTable({ 
  data, 
  valueKey, 
  valueLabel,
  currentUserId,
  lowerIsBetter,
  formatValue,
}: { 
  data: LeaderboardEntry[]
  valueKey: keyof LeaderboardEntry
  valueLabel: string
  currentUserId?: string
  lowerIsBetter?: boolean
  formatValue?: (value: number | null) => string
}) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="mb-3 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">No leaderboard data yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {data.slice(0, 10).map((entry, index) => {
        const isCurrentUser = entry.user_id === currentUserId
        const value = entry[valueKey]
        const displayValue = formatValue ? formatValue(value as number | null) : value

        return (
          <div
            key={entry.user_id}
            className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
              isCurrentUser ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              index === 0 ? 'bg-yellow-500 text-yellow-950' :
              index === 1 ? 'bg-gray-300 text-gray-800' :
              index === 2 ? 'bg-amber-600 text-amber-50' :
              'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {entry.profiles?.first_name} {entry.profiles?.last_name}
                {isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{displayValue}</p>
              <p className="text-xs text-muted-foreground">{valueLabel}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Gift, Ticket, Trophy, Clock } from 'lucide-react'
import { DrawEntryButton } from '@/components/dashboard/draw-entry-button'

export default async function DrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's subscription to determine draw entries
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  // Get active draws
  const { data: activeDraws } = await supabase
    .from('draws')
    .select('*, rewards(*)')
    .eq('status', 'active')
    .gte('end_date', new Date().toISOString())
    .order('end_date', { ascending: true })

  // Get user's draw entries
  const { data: userEntries } = await supabase
    .from('draw_entries')
    .select('*, draws(*, rewards(*))')
    .eq('user_id', user.id)

  // Get user's won rewards
  const { data: userRewards } = await supabase
    .from('user_rewards')
    .select('*, rewards(*), draws(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get past draws
  const { data: pastDraws } = await supabase
    .from('draws')
    .select('*, rewards(*)')
    .eq('status', 'completed')
    .order('drawn_at', { ascending: false })
    .limit(5)

  const maxEntries = subscription?.subscription_plans?.draw_entries || 0
  const activeDrawIds = activeDraws?.map(d => d.id) || []
  const usedEntriesThisMonth = userEntries?.filter(e => activeDrawIds.includes(e.draw_id)).length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Draws & Rewards</h1>
        <p className="text-muted-foreground">Enter monthly draws and track your rewards.</p>
      </div>

      {/* Entry Status */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Ticket className="h-7 w-7" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {usedEntriesThisMonth} / {maxEntries}
              </p>
              <p className="text-sm text-muted-foreground">Entries Used This Month</p>
            </div>
          </div>
          {subscription ? (
            <Badge variant="secondary" className="text-sm">
              {subscription.subscription_plans?.name} Plan
            </Badge>
          ) : (
            <Badge variant="outline" className="text-sm">
              No Active Subscription
            </Badge>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="active" className="gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Active Draws</span>
            <span className="sm:hidden">Active</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">My Rewards</span>
            <span className="sm:hidden">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Past Draws</span>
            <span className="sm:hidden">Past</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeDraws && activeDraws.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeDraws.map((draw) => {
                const hasEntered = userEntries?.some(e => e.draw_id === draw.id)
                const canEnter = !hasEntered && usedEntriesThisMonth < maxEntries && subscription
                const daysLeft = Math.ceil((new Date(draw.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                return (
                  <Card key={draw.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{draw.name}</CardTitle>
                          <CardDescription>{draw.description}</CardDescription>
                        </div>
                        <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'}>
                          {daysLeft} days left
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {draw.rewards && (
                        <div className="mb-4 rounded-lg border border-border p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                              <Gift className="h-5 w-5 text-chart-4" />
                            </div>
                            <div>
                              <p className="font-semibold">{draw.rewards.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Value: ${draw.rewards.value}
                              </p>
                            </div>
                          </div>
                          {draw.rewards.description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {draw.rewards.description}
                            </p>
                          )}
                        </div>
                      )}

                      {hasEntered ? (
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-3 text-sm font-medium text-primary">
                          <Ticket className="mr-2 h-4 w-4" />
                          You&apos;re entered!
                        </div>
                      ) : (
                        <DrawEntryButton
                          drawId={draw.id}
                          userId={user.id}
                          canEnter={!!canEnter}
                          reason={
                            !subscription 
                              ? 'Subscribe to enter draws' 
                              : usedEntriesThisMonth >= maxEntries 
                                ? 'No entries remaining this month'
                                : undefined
                          }
                        />
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Gift className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="font-medium">No Active Draws</p>
                <p className="text-sm text-muted-foreground">Check back soon for new opportunities!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          {userRewards && userRewards.length > 0 ? (
            <div className="space-y-4">
              {userRewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-chart-4/10">
                      <Trophy className="h-7 w-7 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{reward.rewards?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Won from {reward.draws?.name} on {new Date(reward.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={reward.status === 'delivered' ? 'default' : 'secondary'}>
                      {reward.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="font-medium">No Rewards Yet</p>
                <p className="text-sm text-muted-foreground">Enter draws for a chance to win!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastDraws && pastDraws.length > 0 ? (
            <div className="space-y-4">
              {pastDraws.map((draw) => (
                <Card key={draw.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="font-semibold">{draw.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Drew on {new Date(draw.drawn_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{draw.rewards?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Winner: {draw.winner_id ? 'Selected' : 'No winner'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="font-medium">No Past Draws</p>
                <p className="text-sm text-muted-foreground">Past draws will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

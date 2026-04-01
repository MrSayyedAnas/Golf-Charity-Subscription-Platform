import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Heart, Gift, DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  // Get stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: activeSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { data: totalDonations } = await supabase
    .from('donations')
    .select('amount')

  const totalDonated = totalDonations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

  const { count: activeDraws } = await supabase
    .from('draws')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: totalScores } = await supabase
    .from('scores')
    .select('*', { count: 'exact', head: true })

  // Recent activity
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentDonations } = await supabase
    .from('donations')
    .select('*, charities(name), profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userCount || 0}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeSubscriptions || 0}</p>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <DollarSign className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalDonated.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Donated</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Gift className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeDraws || 0}</p>
              <p className="text-sm text-muted-foreground">Active Draws</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No users yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest charitable contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDonations && recentDonations.length > 0 ? (
              <div className="space-y-3">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{donation.charities?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        From {donation.profiles?.first_name} {donation.profiles?.last_name}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">${donation.amount?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No donations yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
            <CardDescription>Overall platform performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border p-4 text-center">
                <Calendar className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-2xl font-bold">{totalScores || 0}</p>
                <p className="text-sm text-muted-foreground">Rounds Logged</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <Heart className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Partner Charities</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <Gift className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Rewards Given</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <TrendingUp className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

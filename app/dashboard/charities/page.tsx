import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CharityAllocationForm } from '@/components/dashboard/charity-allocation-form'
import { Heart, DollarSign } from 'lucide-react'

export default async function CharitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get all active charities
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('name')

  // Get user's current allocations
  const { data: allocations } = await supabase
    .from('charity_allocations')
    .select('*, charities(*)')
    .eq('user_id', user.id)

  // Get user's donation history
  const { data: donations } = await supabase
    .from('donations')
    .select('*, charities(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const totalDonated = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Charities</h1>
        <p className="text-muted-foreground">Choose where your subscription impact goes.</p>
      </div>

      {/* Impact Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allocations?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Charities You Support</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalDonated.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Contributed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Allocation Manager */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Settings</CardTitle>
            <CardDescription>
              Distribute your charitable contribution across multiple causes. Allocations must total 100%.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CharityAllocationForm 
              userId={user.id}
              charities={charities || []}
              currentAllocations={allocations || []}
            />
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>Your recent charitable contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {donations && donations.length > 0 ? (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{donation.charities?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">${donation.amount?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No donations yet</p>
                <p className="text-sm text-muted-foreground">
                  Donations are processed at the end of each billing cycle
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Charities */}
      <Card>
        <CardHeader>
          <CardTitle>Available Charities</CardTitle>
          <CardDescription>Learn more about our partner organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {charities?.map((charity) => (
              <div key={charity.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{charity.name}</h3>
                    <span className="text-xs text-muted-foreground">{charity.category}</span>
                  </div>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{charity.description}</p>
                {charity.website_url && (
                  <a 
                    href={charity.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

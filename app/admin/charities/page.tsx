import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, DollarSign, Users } from 'lucide-react'

export default async function AdminCharitiesPage() {
  const supabase = await createClient()

  const { data: charities } = await supabase
    .from('charities')
    .select(`
      *,
      donations(amount),
      charity_allocations(count)
    `)
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Charity Management</h1>
        <p className="text-muted-foreground">Manage partner charities and track donations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {charities?.map((charity) => {
          const totalDonated = charity.donations?.reduce(
            (sum: number, d: { amount: number }) => sum + (d.amount || 0),
            0
          ) || 0
          const supporters = charity.charity_allocations?.[0]?.count || 0

          return (
            <Card key={charity.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{charity.name}</CardTitle>
                  <Badge variant={charity.is_active ? 'default' : 'secondary'}>
                    {charity.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{charity.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {charity.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <DollarSign className="mx-auto h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">${totalDonated.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Raised</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <Users className="mx-auto h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">{supporters}</p>
                    <p className="text-xs text-muted-foreground">Supporters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            <CardTitle>Donation Summary</CardTitle>
          </div>
          <CardDescription>Total impact across all charities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                ${charities?.reduce(
                  (sum, c) => sum + (c.donations?.reduce(
                    (s: number, d: { amount: number }) => s + (d.amount || 0),
                    0
                  ) || 0),
                  0
                ).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total Donated</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold">{charities?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Partner Charities</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-3xl font-bold">
                {charities?.reduce(
                  (sum, c) => sum + (c.charity_allocations?.[0]?.count || 0),
                  0
                )}
              </p>
              <p className="text-sm text-muted-foreground">Total Allocations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

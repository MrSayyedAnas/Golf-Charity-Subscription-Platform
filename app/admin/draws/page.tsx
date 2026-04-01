import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Gift, Plus, Calendar, Users } from 'lucide-react'
import { CreateDrawForm } from '@/components/admin/create-draw-form'
import { RunDrawButton } from '@/components/admin/run-draw-button'

export default async function AdminDrawsPage() {
  const supabase = await createClient()

  const { data: draws } = await supabase
    .from('draws')
    .select(`
      *,
      rewards(*),
      draw_entries(count)
    `)
    .order('created_at', { ascending: false })

  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Draw Management</h1>
          <p className="text-muted-foreground">Create and manage monthly draws.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create New Draw */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Create New Draw</CardTitle>
            </div>
            <CardDescription>Set up a new draw for members to enter</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateDrawForm rewards={rewards || []} />
          </CardContent>
        </Card>

        {/* Active Draws */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Active Draws</CardTitle>
            </div>
            <CardDescription>Draws currently open for entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {draws?.filter(d => d.status === 'active').map((draw) => (
                <div key={draw.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{draw.name}</h3>
                      <p className="text-sm text-muted-foreground">{draw.rewards?.name}</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {draw.draw_entries?.[0]?.count || 0} entries
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ends {new Date(draw.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <RunDrawButton drawId={draw.id} drawName={draw.name} />
                </div>
              ))}
              {draws?.filter(d => d.status === 'active').length === 0 && (
                <p className="text-center text-muted-foreground">No active draws</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Draws */}
      <Card>
        <CardHeader>
          <CardTitle>All Draws</CardTitle>
          <CardDescription>Complete draw history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {draws?.map((draw) => (
              <div key={draw.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{draw.name}</h3>
                    <Badge variant={
                      draw.status === 'active' ? 'default' :
                      draw.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {draw.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {draw.rewards?.name} - {draw.draw_entries?.[0]?.count || 0} entries
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Created: {new Date(draw.created_at).toLocaleDateString()}</p>
                  {draw.drawn_at && (
                    <p>Drawn: {new Date(draw.drawn_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

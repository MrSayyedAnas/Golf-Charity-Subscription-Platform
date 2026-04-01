import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      *,
      subscriptions(status, subscription_plans(name))
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage platform users.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>All Users</CardTitle>
          </div>
          <CardDescription>
            {profiles?.length || 0} total users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Handicap</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => {
                const activeSubscription = profile.subscriptions?.find(
                  (s: { status: string }) => s.status === 'active'
                )
                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {profile.first_name} {profile.last_name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {activeSubscription ? (
                        <Badge variant="default">
                          {activeSubscription.subscription_plans?.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No Plan</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile.handicap_index?.toFixed(1) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

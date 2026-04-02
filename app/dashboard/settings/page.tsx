import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { User, Mail, Shield } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('❌ Error fetching profile:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ProfileForm
              userId={user.id}
              initialData={{
                firstName: profile?.first_name ?? '',
                lastName: profile?.last_name ?? '',
                handicapIndex:
                  profile?.handicap_index?.toString() ?? '',
                homeCourse: profile?.home_course ?? '',
              }}
            />
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Email Address</CardTitle>
            </div>
            <CardDescription>Your account email</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="rounded-lg border bg-muted/50 px-4 py-3">
              {user.email}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact support to change your email address.
            </p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your account security
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed: Never
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Contact support if you need to reset your password.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
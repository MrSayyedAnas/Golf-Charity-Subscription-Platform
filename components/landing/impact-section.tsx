import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'

const stats = [
  {
    icon: DollarSign,
    value: '$125,000+',
    label: 'Total Donated',
    description: 'Direct contributions to our charity partners',
  },
  {
    icon: Users,
    value: '2,500+',
    label: 'Active Members',
    description: 'Golfers making a difference every round',
  },
  {
    icon: Calendar,
    value: '15,000+',
    label: 'Rounds Logged',
    description: 'Scores tracked, impact created',
  },
  {
    icon: TrendingUp,
    value: '4',
    label: 'Charity Partners',
    description: 'Vetted organizations receiving funds',
  },
]

export function ImpactSection() {
  return (
    <section id="impact" className="bg-foreground py-20 text-background md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Our Collective Impact
          </h2>
          <p className="text-pretty text-lg opacity-80">
            See what our community has achieved together. Every subscription, every round, every score contributes to something bigger.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-background/10 bg-background/5 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
                  <stat.icon className="h-6 w-6 text-background" />
                </div>
                <div className="mb-1 text-3xl font-bold text-background">{stat.value}</div>
                <div className="mb-2 font-medium text-background">{stat.label}</div>
                <p className="text-sm text-background/70">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-2xl bg-background/10 p-8 backdrop-blur">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-xl font-semibold text-background">Monthly Impact Growth</h3>
              <p className="text-sm text-background/70">Our community&apos;s charitable contributions over time</p>
            </div>

            {/* Simple bar chart visualization */}
            <div className="flex items-end justify-between gap-2 h-32">
              {[35, 42, 55, 48, 62, 75, 68, 82, 90, 85, 95, 100].map((height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-background/50">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

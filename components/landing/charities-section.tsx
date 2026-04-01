import { Card, CardContent } from '@/components/ui/card'
import { Waves, GraduationCap, Utensils, Brain } from 'lucide-react'

const charities = [
  {
    name: 'Ocean Conservation Fund',
    description: 'Protecting marine ecosystems and coastal communities worldwide.',
    icon: Waves,
    color: 'bg-blue-500/10 text-blue-600',
    raised: '$32,450',
  },
  {
    name: 'Youth Education Initiative',
    description: 'Providing quality education access to underserved communities.',
    icon: GraduationCap,
    color: 'bg-amber-500/10 text-amber-600',
    raised: '$28,120',
  },
  {
    name: 'Food Security Network',
    description: 'Fighting hunger and food insecurity in local communities.',
    icon: Utensils,
    color: 'bg-green-500/10 text-green-600',
    raised: '$35,890',
  },
  {
    name: 'Mental Health Alliance',
    description: 'Supporting mental health resources and awareness programs.',
    icon: Brain,
    color: 'bg-purple-500/10 text-purple-600',
    raised: '$29,540',
  },
]

export function CharitiesSection() {
  return (
    <section id="charities" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Your Choice, Your Impact
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose from our vetted charity partners. 100% of allocated funds go directly to your selected causes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {charities.map((charity) => (
            <Card key={charity.name} className="group overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${charity.color}`}>
                  <charity.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 font-semibold">{charity.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{charity.description}</p>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">Total Raised</span>
                  <span className="font-semibold text-primary">{charity.raised}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Want your charity featured?</h3>
          <p className="text-muted-foreground">
            We&apos;re always looking to partner with impactful organizations. 
            Reach out to discuss how we can work together.
          </p>
        </div>
      </div>
    </section>
  )
}

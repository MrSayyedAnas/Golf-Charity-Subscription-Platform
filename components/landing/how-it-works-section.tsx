import { CreditCard, Target, Gift, Heart } from 'lucide-react'

const steps = [
  {
    icon: CreditCard,
    title: 'Subscribe',
    description: 'Choose a plan that fits your game. Basic, Premium, or Elite - each tier increases your impact and rewards.',
  },
  {
    icon: Target,
    title: 'Play & Log Scores',
    description: 'Hit the course and log your rounds. Track your progress, handicap, and see how you stack up on the leaderboard.',
  },
  {
    icon: Heart,
    title: 'Support Charities',
    description: 'A portion of your subscription goes directly to your chosen charities. You decide where your impact goes.',
  },
  {
    icon: Gift,
    title: 'Win Rewards',
    description: 'Enter monthly draws for exclusive golf gear, experiences, and more. Higher tiers mean more entries.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            How It Works
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Four simple steps to transform your golf game into a force for good.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Connection line for desktop */}
        <div className="mt-8 hidden lg:block">
          <div className="mx-auto h-0.5 w-3/4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}

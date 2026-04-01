'use client'

import { Target } from 'lucide-react'

interface Score {
  id: string
  course_name: string
  total_score: number
  course_par: number
  handicap_differential: number
  played_at: string
}

interface ScoreHistoryProps {
  scores: Score[]
}

export function ScoreHistory({ scores }: ScoreHistoryProps) {
  if (scores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Target className="mb-3 h-12 w-12 text-muted-foreground/50" />
        <p className="font-medium">No rounds logged yet</p>
        <p className="text-sm text-muted-foreground">
          Log your first round to start tracking your progress
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {scores.map((score) => {
        const differential = score.total_score - score.course_par
        return (
          <div
            key={score.id}
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{score.course_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(score.played_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-2xl font-bold">{score.total_score}</p>
              <p className={`text-sm ${differential > 0 ? 'text-destructive' : differential < 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                {differential > 0 ? '+' : ''}{differential} ({score.course_par} par)
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

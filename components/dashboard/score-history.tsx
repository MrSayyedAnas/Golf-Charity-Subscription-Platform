'use client'

import { Target } from 'lucide-react'

interface Score {
  id: string
  course_name: string
  gross_score: number
  date_played: string
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
        return (
          <div
            key={score.id}
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{score.course_name}</p>

              {/* ✅ FIXED DATE */}
              <p className="text-sm text-muted-foreground">
                {new Date(score.date_played).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* ✅ FIXED SCORE DISPLAY */}
            <div className="ml-4 text-right">
              <p className="text-2xl font-bold">{score.gross_score}</p>
              <p className="text-sm text-muted-foreground">
                Gross Score
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
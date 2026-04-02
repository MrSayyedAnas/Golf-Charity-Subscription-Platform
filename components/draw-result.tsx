'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Winner {
  id?: string
  user_id: string
  gross_score: number
}

interface DrawResponse {
  drawNumber: number
  winners: Winner[]
}

export function DrawResult() {
  const [data, setData] = useState<DrawResponse | null>(null)
  const [loading, setLoading] = useState(false)

  async function runDraw() {
    setLoading(true)

    try {
      const res = await fetch('/api/draw')
      const result = await res.json()

      if (!res.ok) {
        console.error('❌ Draw API error:', result)
        setLoading(false)
        return
      }

      setData(result)
    } catch (err) {
      console.error('❌ Draw error:', err)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <Button onClick={runDraw} disabled={loading}>
        {loading ? 'Running draw...' : 'Run Monthly Draw'}
      </Button>

      {/* ✅ Results */}
      {data && (
        <div className="rounded-lg border p-4 space-y-3">
          <p className="font-bold text-lg">
            🎯 Winning Number: {data.drawNumber}
          </p>

          <h3 className="font-semibold">🏆 Winners</h3>

          {data.winners && data.winners.length > 0 ? (
            data.winners.map((w, i) => (
              <div
                key={`${w.user_id}-${i}`}  // ✅ FIXED KEY
                className="flex justify-between text-sm border-b pb-1"
              >
                <span>
                  #{i + 1} — User: {w.user_id}
                </span>

                <span className="font-medium">
                  Score: {w.gross_score}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No winners found
            </p>
          )}
        </div>
      )}
    </div>
  )
}
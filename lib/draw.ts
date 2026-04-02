export function generateDrawNumber() {
  return Math.floor(Math.random() * 50) + 1
}

export function getUserNumber(score: number) {
  // simple mapping from score → number
  return score % 50 || 1
}

export function calculateWinners(scores: any[]) {
  const drawNumber = generateDrawNumber()

  const results = scores.map((s) => {
    const userNumber = getUserNumber(s.gross_score)

    return {
      userId: s.user_id,
      score: s.gross_score,
      userNumber,
      diff: Math.abs(drawNumber - userNumber),
    }
  })

  results.sort((a, b) => a.diff - b.diff)

  return {
    drawNumber,
    winners: results.slice(0, 3), // top 3
  }
}
export interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextDue: string
}

// quality: 1 = blackout, 2 = hard, 3 = good, 4 = easy
export function sm2(card: {
  easeFactor: number
  interval: number
  repetitions: number
}, quality: 1 | 2 | 3 | 4): SM2Result {
  const q = quality - 1  // shift to 0–3 for classic SM-2

  let { easeFactor, interval, repetitions } = card

  if (q < 2) {
    // failed recall — reset
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (3 - q) * (0.08 + (3 - q) * 0.02)
  )

  const nextDue = new Date()
  nextDue.setDate(nextDue.getDate() + interval)

  return {
    easeFactor,
    interval,
    repetitions,
    nextDue: nextDue.toISOString(),
  }
}

export interface ReviewCardType {
  noteId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextDue: string
  lastRating?: 1 | 2 | 3 | 4
}

export function getDueCards(cards: ReviewCardType[]): ReviewCardType[] {
  const now = new Date()
  return cards
    .filter(c => new Date(c.nextDue) <= now)
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
}

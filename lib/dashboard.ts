import type { ActivityEvent, Pattern, ReviewCard } from "./types"

type ActivityBucket = {
  date: string
  count: number
}

export type RecentActivityItem = {
  id: string
  label: string
  timestamp: string
  href: string
}

export type WeakPatternItem = {
  id: string
  name: string
  solved: number
  total: number
  solvedRatio: number
  recentLowRatings: number
}

export function getDueCount(reviewCards: ReviewCard[]) {
  const now = Date.now()
  return reviewCards.filter((card) => new Date(card.nextDue).getTime() <= now).length
}

export function getSolvedStats(patterns: Pattern[]) {
  const total = patterns.reduce((sum, pattern) => sum + pattern.subquestions.length, 0)
  const solved = patterns.reduce(
    (sum, pattern) => sum + pattern.subquestions.filter((subquestion) => subquestion.status === "solved").length,
    0
  )

  return {
    solved,
    total,
    solveRate: total === 0 ? 0 : Math.round((solved / total) * 100),
  }
}

export function getReviewRatingMix(activityLog: ActivityEvent[]) {
  const recentRatings = activityLog
    .filter((event) => event.type === "review-rated" && typeof event.rating === "number")
    .slice(-20)

  return {
    total: recentRatings.length,
    blackout: recentRatings.filter((event) => event.rating === 1).length,
    hard: recentRatings.filter((event) => event.rating === 2).length,
    good: recentRatings.filter((event) => event.rating === 3).length,
    easy: recentRatings.filter((event) => event.rating === 4).length,
  }
}

export function getLocalDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getDashboardActivity(patterns: Pattern[], activityLog: ActivityEvent[]) {
  const existingSolvedEvents = new Set(
    activityLog
      .filter((event) => event.type === "subquestion-solved" && event.subquestionId)
      .map((event) => event.subquestionId as string)
  )

  const backfilledSolvedEvents: ActivityEvent[] = patterns.flatMap((pattern) =>
    pattern.subquestions.flatMap((subquestion) => {
      if (
        subquestion.status !== "solved" ||
        !subquestion.solvedAt ||
        existingSolvedEvents.has(subquestion.id)
      ) {
        return []
      }

      return [{
        id: `backfill-solved-${pattern.id}-${subquestion.id}`,
        type: "subquestion-solved" as const,
        timestamp: subquestion.solvedAt,
        patternId: pattern.id,
        subquestionId: subquestion.id,
      }]
    })
  )

  return [...activityLog, ...backfilledSolvedEvents].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

export function getActivityBuckets(activityLog: ActivityEvent[], days = 84): ActivityBucket[] {
  const counts = new Map<string, number>()
  for (const event of activityLog) {
    const date = getLocalDateKey(event.timestamp)
    counts.set(date, (counts.get(date) || 0) + 1)
  }

  const buckets: ActivityBucket[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const key = getLocalDateKey(date)
    buckets.push({
      date: key,
      count: counts.get(key) || 0,
    })
  }

  return buckets
}

export function getActivityWeeks(activityLog: ActivityEvent[], weeks = 12) {
  const dailyCounts = new Map<string, number>()
  for (const bucket of getActivityBuckets(activityLog, weeks * 7 + 7)) {
    dailyCounts.set(bucket.date, bucket.count)
  }

  const end = new Date()
  end.setHours(0, 0, 0, 0)

  const start = new Date(end)
  start.setDate(end.getDate() - (weeks * 7 - 1))
  start.setDate(start.getDate() - start.getDay())

  const buckets: ActivityBucket[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    const key = getLocalDateKey(cursor)
    buckets.push({
      date: key,
      count: dailyCounts.get(key) || 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  const columns: ActivityBucket[][] = []

  for (let index = 0; index < buckets.length; index += 7) {
    columns.push(buckets.slice(index, index + 7))
  }

  return columns
}

export function getMostActiveDays(activityLog: ActivityEvent[]) {
  return [...getActivityBuckets(activityLog, 84)]
    .sort((a, b) => b.count - a.count || b.date.localeCompare(a.date))
    .filter((bucket) => bucket.count > 0)
    .slice(0, 3)
}

export function getWeakPatterns(patterns: Pattern[], activityLog: ActivityEvent[]): WeakPatternItem[] {
  const lowRatingCounts = new Map<string, number>()
  for (const event of activityLog) {
    if (event.type === "review-rated" && (event.rating === 1 || event.rating === 2)) {
      lowRatingCounts.set(event.patternId, (lowRatingCounts.get(event.patternId) || 0) + 1)
    }
  }

  return patterns
    .filter((pattern) => pattern.subquestions.length > 0)
    .map((pattern) => {
      const solved = pattern.subquestions.filter((subquestion) => subquestion.status === "solved").length
      const total = pattern.subquestions.length
      const solvedRatio = total === 0 ? 0 : solved / total

      return {
        id: pattern.id,
        name: pattern.name,
        solved,
        total,
        solvedRatio,
        recentLowRatings: lowRatingCounts.get(pattern.id) || 0,
      }
    })
    .sort((a, b) => {
      if (b.recentLowRatings !== a.recentLowRatings) return b.recentLowRatings - a.recentLowRatings
      if (a.solvedRatio !== b.solvedRatio) return a.solvedRatio - b.solvedRatio
      return a.name.localeCompare(b.name)
    })
    .slice(0, 4)
}

export function getRecentActivityFeed(activityLog: ActivityEvent[], patterns: Pattern[]): RecentActivityItem[] {
  const sorted = [...activityLog]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return sorted.flatMap((event) => {
    const pattern = patterns.find((entry) => entry.id === event.patternId)
    if (!pattern) return []

    const subquestion = event.subquestionId
      ? pattern.subquestions.find((entry) => entry.id === event.subquestionId)
      : undefined

    if (event.type === "subquestion-solved" && subquestion) {
      return [{
        id: event.id,
        label: `Solved ${subquestion.title} under ${pattern.name}`,
        timestamp: event.timestamp,
        href: `/patterns/${pattern.id}/${subquestion.id}`,
      }]
    }

    if (event.type === "review-rated") {
      const ratingLabel = event.rating === 1 ? "Blackout" : event.rating === 2 ? "Hard" : event.rating === 3 ? "Good" : "Easy"
      const targetLabel = subquestion ? `${subquestion.title}` : `${pattern.name}`
      const href = subquestion ? `/patterns/${pattern.id}/${subquestion.id}` : `/patterns/${pattern.id}`

      return [{
        id: event.id,
        label: `Rated ${targetLabel} review: ${ratingLabel}`,
        timestamp: event.timestamp,
        href,
      }]
    }

    return []
  })
}

export function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function formatRelativeTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

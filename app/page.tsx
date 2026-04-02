"use client"
import Link from "next/link"

import {
  formatRelativeTimestamp,
  formatShortDate,
  getActivityWeeks,
  getDashboardActivity,
  getDueCount,
  getLocalDateKey,
  getMostActiveDays,
  getRecentActivityFeed,
  getReviewRatingMix,
  getSolvedStats,
  getWeakPatterns,
} from "@/lib/dashboard"
import { useStore } from "@/lib/store"

function getIntensityLevel(count: number, maxCount: number) {
  if (count <= 0) return 0
  if (maxCount <= 1) return 3

  const ratio = count / maxCount
  if (ratio < 0.34) return 1
  if (ratio < 0.67) return 2
  return 3
}

function ActivityCell({
  date,
  count,
  maxCount,
  muted = false,
}: {
  date: string
  count: number
  maxCount: number
  muted?: boolean
}) {
  const level = getIntensityLevel(count, maxCount)
  const intensityClass =
    level === 0
      ? "bg-[var(--bg)]"
      : level === 1
        ? "bg-white/35"
        : level === 2
          ? "bg-white/65"
          : "bg-white"
  const borderClass = muted ? "border-[var(--border)]/60" : "border-[var(--border)]"

  return (
    <div
      title={`${formatShortDate(date)}: ${count} activity ${count === 1 ? "event" : "events"}`}
      className={`h-4 w-4 rounded-[4px] border ${borderClass} ${intensityClass} shrink-0`}
    />
  )
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Home() {
  const { patterns, reviewCards, activityLog } = useStore()

  const dashboardActivity = getDashboardActivity(patterns, activityLog)
  const dueCount = getDueCount(reviewCards)
  const solvedStats = getSolvedStats(patterns)
  const ratingMix = getReviewRatingMix(activityLog)
  const weakPatterns = getWeakPatterns(patterns, activityLog)
  const recentFeed = getRecentActivityFeed(dashboardActivity, patterns)
  const calendarWeeks = getActivityWeeks(dashboardActivity, 12)
  const calendarBuckets = calendarWeeks.flat()
  const activeDays = calendarBuckets.filter((bucket) => bucket.count > 0).length
  const mostActiveDays = getMostActiveDays(dashboardActivity)
  const busiestDay = mostActiveDays[0]?.count || 0
  const maxCount = Math.max(...calendarBuckets.map((bucket) => bucket.count), 0)
  const legendCounts =
    maxCount <= 1
      ? [0, 1]
      : [0, Math.max(1, Math.ceil(maxCount * 0.25)), Math.max(1, Math.ceil(maxCount * 0.6)), maxCount]
  const monthLabels = calendarWeeks.map((week, index) => {
    const firstDate = week[0]?.date
    if (!firstDate) return ""

    const month = new Date(firstDate).toLocaleDateString(undefined, { month: "short" })
    if (index === 0) return month

    const previousDate = calendarWeeks[index - 1]?.[0]?.date
    if (!previousDate) return month

    return previousDate.slice(5, 7) !== firstDate.slice(5, 7) ? month : ""
  })

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 pb-16">
        <section className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Dashboard
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
                  What should you work on next?
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                  Your queue, progress, and recent study activity live here. The calendar starts
                  tracking from now forward, and solved questions from your existing library are shown too.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/review"
                className="rounded border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--bg)] shadow-sm transition-opacity hover:opacity-90"
              >
                {dueCount > 0 ? `Start Review (${dueCount})` : "Open Review Queue"}
              </Link>
              <Link
                href="/patterns"
                className="rounded border border-[var(--border)] px-5 py-3 text-sm font-bold transition-colors hover:bg-[var(--bg-hover)]"
              >
                Browse Patterns
              </Link>
              <Link
                href="/patterns/new"
                className="rounded border border-[var(--border)] px-5 py-3 text-sm font-bold transition-colors hover:bg-[var(--bg-hover)]"
              >
                New Pattern
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Due Today
            </p>
            <p className="mt-3 text-4xl font-extrabold">{dueCount}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {dueCount > 0 ? "Your review queue is ready." : "No due reviews right now."}
            </p>
          </div>

          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Solved Questions
            </p>
            <p className="mt-3 text-4xl font-extrabold">{solvedStats.solved}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {solvedStats.total > 0
                ? `${solvedStats.solveRate}% of your tracked questions`
                : "Start adding questions to build momentum."}
            </p>
          </div>

          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Review Quality
            </p>
            <p className="mt-3 text-4xl font-extrabold">{ratingMix.total}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {ratingMix.total > 0
                ? `${ratingMix.good + ratingMix.easy} confident reviews in the recent mix`
                : "No review history yet."}
            </p>
          </div>

          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Active Days
            </p>
            <p className="mt-3 text-4xl font-extrabold">{activeDays}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {activeDays > 0 ? "Days with logged solve/review activity." : "Calendar starts with your next session."}
            </p>
          </div>
        </section>

        <section className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="self-start rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text)]">Activity Calendar</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Last 12 weeks of solved questions and review ratings.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {dashboardActivity.length} total events
              </p>
            </div>

            {dashboardActivity.length === 0 ? (
              <div className="rounded border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-8 text-sm text-[var(--text-muted)]">
                No activity yet. Once you solve a question or rate a review card, your study history
                will start filling this calendar automatically.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="self-start overflow-x-auto">
                    <div className="inline-block rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                      <div className="flex min-w-max gap-3">
                        <div className="grid grid-rows-7 gap-1.5 pt-6 pr-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          {DAY_LABELS.map((label) => (
                            <span key={label} className="flex h-4 items-center">{label}</span>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-flow-col auto-cols-max gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            {monthLabels.map((label, index) => (
                              <span key={`${label}-${index}`} className="w-4 text-left">
                                {label}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                            {calendarWeeks.flat().map((bucket) => (
                              <ActivityCell key={bucket.date} date={bucket.date} count={bucket.count} maxCount={maxCount} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        Logged Days
                      </p>
                      <p className="mt-2 text-2xl font-extrabold">{activeDays}</p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Days with at least one solve or review event.
                      </p>
                    </div>

                    <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        Busiest Day
                      </p>
                      <p className="mt-2 text-2xl font-extrabold">{busiestDay}</p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Most events recorded in a single day.
                      </p>
                    </div>

                    <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        Scale
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <ActivityCell date={getLocalDateKey(new Date())} count={Math.max(1, maxCount)} maxCount={Math.max(1, maxCount)} />
                        <p className="text-sm text-[var(--text-muted)]">
                          {maxCount <= 1
                            ? "Any logged day shows up as a bright cell."
                            : "Brighter cells mark busier days."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="font-bold uppercase tracking-[0.16em]">Intensity</span>
                    {maxCount <= 1 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <ActivityCell date="2026-01-01" count={0} maxCount={1} muted />
                          <span>Empty</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ActivityCell date="2026-01-02" count={1} maxCount={1} muted />
                          <span>Active</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-1.5">
                          <ActivityCell date="2026-01-01" count={legendCounts[0]} maxCount={Math.max(1, maxCount)} muted />
                          <ActivityCell date="2026-01-02" count={legendCounts[1]} maxCount={Math.max(1, maxCount)} muted />
                          <ActivityCell date="2026-01-03" count={legendCounts[2]} maxCount={Math.max(1, maxCount)} muted />
                          <ActivityCell date="2026-01-04" count={legendCounts[3]} maxCount={Math.max(1, maxCount)} muted />
                        </div>
                        <span>Less</span>
                        <span>{legendCounts[1]}</span>
                        <span>{legendCounts[2]}</span>
                        <span>{legendCounts[3]}</span>
                        <span>More</span>
                      </>
                    )}
                  </div>
                </div>

                {mostActiveDays.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-3">
                    {mostActiveDays.map((bucket, index) => (
                      <div key={bucket.date} className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                          {index === 0 ? "Peak Day" : "Hot Streak"}
                        </p>
                        <p className="mt-2 text-lg font-bold">{formatShortDate(bucket.date)}</p>
                        <p className="text-sm text-[var(--text-muted)]">{bucket.count} activity events</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
              <h2 className="text-xl font-extrabold text-[var(--text)]">Weak Spots</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Patterns with low solve coverage and recent hard review ratings.
              </p>

              <div className="mt-5 space-y-3">
                {weakPatterns.length === 0 ? (
                  <div className="rounded border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-muted)]">
                    Add patterns and solve a few questions to surface weak spots here.
                  </div>
                ) : (
                  weakPatterns.map((pattern) => (
                    <Link
                      key={pattern.id}
                      href={`/patterns/${pattern.id}`}
                      className="block rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4 transition-colors hover:bg-[var(--bg-hover)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-[var(--text)]">{pattern.name}</p>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                          {Math.round(pattern.solvedRatio * 100)}%
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {pattern.solved}/{pattern.total} solved
                        {pattern.recentLowRatings > 0 ? ` · ${pattern.recentLowRatings} recent hard reviews` : ""}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
              <h2 className="text-xl font-extrabold text-[var(--text)]">Recent Review Mix</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Last 20 rating events from your review sessions.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
                  <p className="font-bold">Blackout</p>
                  <p className="mt-1 text-[var(--text-muted)]">{ratingMix.blackout}</p>
                </div>
                <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
                  <p className="font-bold">Hard</p>
                  <p className="mt-1 text-[var(--text-muted)]">{ratingMix.hard}</p>
                </div>
                <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
                  <p className="font-bold">Good</p>
                  <p className="mt-1 text-[var(--text-muted)]">{ratingMix.good}</p>
                </div>
                <div className="rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
                  <p className="font-bold">Easy</p>
                  <p className="mt-1 text-[var(--text-muted)]">{ratingMix.easy}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text)]">Recent Activity</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                The latest solves and review outcomes across your library.
              </p>
            </div>
            <Link href="/patterns" className="text-sm font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]">
              Open Library
            </Link>
          </div>

          {recentFeed.length === 0 ? (
            <div className="rounded border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-muted)]">
              Your feed will show solved questions and review ratings once you start using the app.
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeed.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col gap-1 rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4 transition-colors hover:bg-[var(--bg-hover)]"
                >
                  <p className="font-semibold text-[var(--text)]">{item.label}</p>
                  <p className="text-sm text-[var(--text-muted)]">{formatRelativeTimestamp(item.timestamp)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

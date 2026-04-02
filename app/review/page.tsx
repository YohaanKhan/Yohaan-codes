"use client"
import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import FlipCard from "@/components/review/FlipCard"
import RatingBar from "@/components/review/RatingBar"
import ReviewProgress from "@/components/review/ReviewProgress"
import { useStore } from "@/lib/store"
import { getDueCards } from "@/lib/sm2"
import type { Difficulty, Note, Pattern, ReviewCard, ReviewCardType } from "@/lib/types"

type SessionCard = {
  reviewCard: ReviewCard
  noteId: string
  href: string
  patternId: string
  patternName: string
  summary: string
  tags: string[]
  cardType: ReviewCardType
  promptMode: "recall" | "recognition"
  promptTitle: string
  promptBody: string
  subquestionTitle: string | undefined
  difficulty: Difficulty | undefined
  answer: string
  code?: string
  codeLanguage?: string
}

type RatingCounts = Record<1 | 2 | 3 | 4, number>

function inferCardType(reviewCard: ReviewCard, note: Note) {
  if (reviewCard.cardType) return reviewCard.cardType
  return note.subquestionId ? "problem-solution" : "pattern-insight"
}

function buildPrompt(cardType: ReviewCardType, pattern: Pattern, subquestionTitle?: string) {
  if (cardType === "problem-solution") {
    return {
      promptTitle: subquestionTitle || pattern.name,
      promptBody:
        "Rebuild the solution from memory. Name the pattern, the invariant you maintain, the edge cases that matter, and the code shape you would write before revealing your saved answer.",
    }
  }

  return {
    promptTitle: `Explain the ${pattern.name} pattern`,
    promptBody:
      "Recall when to use this pattern, the core idea behind it, the usual complexity tradeoffs, and the pitfalls you wanted your future self to remember.",
  }
}

function buildSessionCards(reviewCards: ReviewCard[], notes: Note[], patterns: Pattern[]): SessionCard[] {
  const mappedCards = (getDueCards(reviewCards) as ReviewCard[]).map((reviewCard) => {
      const note = notes.find((entry) => entry.id === reviewCard.noteId)
      if (!note) return null

      const pattern = patterns.find((entry) => entry.id === note.patternId)
      if (!pattern) return null

      const subquestion = note.subquestionId
        ? pattern.subquestions.find((entry) => entry.id === note.subquestionId)
        : undefined

      if (note.subquestionId && !subquestion) return null

      const cardType = inferCardType(reviewCard, note)
      const prompt = buildPrompt(cardType, pattern, subquestion?.title)

      return {
        reviewCard,
        noteId: note.id,
        href: subquestion ? `/patterns/${pattern.id}/${subquestion.id}` : `/patterns/${pattern.id}`,
        patternId: pattern.id,
        patternName: pattern.name,
        summary: pattern.summary,
        tags: pattern.tags,
        cardType,
        promptMode: reviewCard.promptMode ?? "recall",
        promptTitle: prompt.promptTitle,
        promptBody: prompt.promptBody,
        subquestionTitle: subquestion?.title,
        difficulty: subquestion?.difficulty,
        answer: note.approach,
        code: note.code || undefined,
        codeLanguage: note.codeLanguage || undefined,
      }
    })

  const cards = (mappedCards.filter((card) => card !== null) as SessionCard[]).sort((a, b) => {
      const dueCompare =
        new Date(a.reviewCard.nextDue).getTime() - new Date(b.reviewCard.nextDue).getTime()
      if (dueCompare !== 0) return dueCompare
      if (a.cardType === b.cardType) return 0
      return a.cardType === "pattern-insight" ? -1 : 1
    })

  return cards
}

export default function ReviewPage() {
  const { patterns, notes, reviewCards, rateCard } = useStore()
  const router = useRouter()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showPostRating, setShowPostRating] = useState(false)
  const [completedCards, setCompletedCards] = useState<SessionCard[]>([])
  const [ratingCounts, setRatingCounts] = useState<RatingCounts>({ 1: 0, 2: 0, 3: 0, 4: 0 })

  const sessionCards = useMemo(
    () => buildSessionCards(reviewCards, notes, patterns),
    [reviewCards, notes, patterns]
  )

  const activeIndex = sessionCards.length === 0 ? 0 : Math.min(currentIndex, sessionCards.length - 1)
  const currentCard = sessionCards[activeIndex]
  const reviewedTotal = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0)
  const harderPatternIds = Array.from(
    new Set(
      completedCards
        .filter((card) => {
          const latestCard = reviewCards.find((entry) => entry.noteId === card.noteId)
          return latestCard?.lastRating === 1 || latestCard?.lastRating === 2
        })
        .map((card) => card.patternId)
    )
  )

  if (sessionCards.length === 0 || !currentCard) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl w-full p-8 border border-[var(--border)] rounded bg-[var(--bg-subtle)] shadow-sm text-left">
          <h2 className="text-2xl font-bold mb-3">
            {reviewedTotal > 0 ? "Session Complete" : "All Caught Up"}
          </h2>
          <p className="text-[var(--text-muted)] mb-6 text-sm">
            {reviewedTotal > 0
              ? "You worked through the current due queue. Use the summary below to jump back into weak spots."
              : "You have no patterns due for review right now. Go learn something new."}
          </p>

          {reviewedTotal > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                  Cards Reviewed
                </p>
                <p className="text-3xl font-bold">{reviewedTotal}</p>
              </div>
              <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                  Rating Mix
                </p>
                <p className="text-sm font-semibold text-[var(--text)]">
                  1:{ratingCounts[1]}  2:{ratingCounts[2]}  3:{ratingCounts[3]}  4:{ratingCounts[4]}
                </p>
              </div>
            </div>
          )}

          {harderPatternIds.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                Patterns To Revisit
              </h3>
              <div className="flex flex-wrap gap-2">
                {harderPatternIds.map((patternId) => {
                  const pattern = patterns.find((entry) => entry.id === patternId)
                  if (!pattern) return null

                  return (
                    <Link
                      key={pattern.id}
                      href={`/patterns/${pattern.id}`}
                      className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      {pattern.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/patterns")}
              className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-bold rounded hover:opacity-90 shadow-sm transition-opacity"
            >
              Back to Patterns
            </button>
            {completedCards.length > 0 && (
              <Link
                href={completedCards[completedCards.length - 1].href}
                className="px-6 py-3 border border-[var(--border)] rounded font-bold hover:bg-[var(--bg-hover)] transition-colors"
              >
                Open Last Source
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  const handleRate = (rating: 1 | 2 | 3 | 4) => {
    rateCard(currentCard.noteId, rating)
    setCompletedCards((prev) => [...prev, currentCard])
    setRatingCounts((prev) => ({ ...prev, [rating]: prev[rating] + 1 }))
    setIsFlipped(false)
    setShowPostRating(true)
  }

  const advanceSession = () => {
    setShowPostRating(false)

    if (activeIndex < sessionCards.length - 1) {
      setCurrentIndex(activeIndex + 1)
      return
    }

    setCurrentIndex(sessionCards.length)
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col justify-center bg-[var(--bg-subtle)]">
      <div className="w-full mb-8">
        <ReviewProgress
          current={activeIndex + 1}
          total={sessionCards.length}
          detail={`${currentCard.cardType === "problem-solution" ? "Problem solution" : "Pattern insight"} card`}
        />
      </div>

      <FlipCard
        card={currentCard}
        answer={currentCard.answer}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(true)}
      />

      {isFlipped && !showPostRating && (
        <div className="mt-8">
          <RatingBar onRate={handleRate} />
        </div>
      )}

      {showPostRating && (
        <div className="mt-8 w-full max-w-4xl mx-auto rounded border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                Next Action
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Jump back into the source note or continue the session.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={currentCard.href}
                className="px-4 py-2.5 border border-[var(--border)] rounded font-bold hover:bg-[var(--bg-hover)] transition-colors"
              >
                Open Source
              </Link>
              <button
                onClick={advanceSession}
                className="px-4 py-2.5 bg-[var(--accent)] text-[var(--bg)] rounded font-bold hover:opacity-90 transition-opacity"
              >
                {activeIndex < sessionCards.length - 1 ? "Continue Session" : "Finish Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

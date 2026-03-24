"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

import FlipCard from "@/components/review/FlipCard"
import ReviewProgress from "@/components/review/ReviewProgress"
import RatingBar from "@/components/review/RatingBar"
import { getDueCards } from "@/lib/sm2"

export default function ReviewPage() {
  const { patterns, notes, reviewCards, rateCard } = useStore()
  const router = useRouter()
  
  const [isClient, setIsClient] = useState(false)
  const [sessionCards, setSessionCards] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const due = getDueCards(reviewCards).filter(card => {
      const parentNote = notes.find(n => n.id === card.noteId)
      const parentPattern = patterns.find(p => p.id === parentNote?.patternId)
      return parentNote && parentPattern
    })
    setSessionCards(due)
  }, [reviewCards, notes, patterns])

  if (!isClient) return null

  if (sessionCards.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 border border-[var(--border)] rounded bg-[var(--bg-subtle)] shadow-sm">
          <h2 className="text-2xl font-bold mb-3">🎈 All Caught Up!</h2>
          <p className="text-[var(--text-muted)] mb-6 text-sm">You have no patterns due for review right now. Go learn something new!</p>
          <button 
            onClick={() => router.push("/patterns")}
            className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] font-bold rounded hover:opacity-90 shadow-sm transition-opacity"
          >
            Back to Patterns
          </button>
        </div>
      </main>
    )
  }

  const currentCard = sessionCards[currentIndex]
  const note = notes.find(n => n.id === currentCard.noteId)
  const pattern = patterns.find(p => p.id === note?.patternId)

  if (!note || !pattern) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-red-500 font-mono text-sm">Error missing note data for card {currentCard.noteId}.</p>
      </main>
    )
  }

  const handleRate = (rating: 1 | 2 | 3 | 4) => {
    rateCard(currentCard.noteId, rating)
    setIsFlipped(false)
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setSessionCards([])
      setCurrentIndex(0)
    }
  }

  const question = {
    title: pattern.name,
    difficulty: "review",
    tags: pattern.tags,
    summary: pattern.summary
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col justify-center bg-[var(--bg-subtle)]">
      <div className="w-full mb-8">
          <ReviewProgress current={currentIndex + 1} total={sessionCards.length} />
        </div>
        
        <FlipCard 
          question={question} 
          answer={note.approach}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(true)}
        />
        
        {isFlipped && (
          <div className="mt-8">
            <RatingBar onRate={handleRate} />
        </div>
      )}
    </main>
  )
}

"use client"
import { useState } from "react"

import PatternCard from "@/components/patterns/PatternCard"
import { useStore } from "@/lib/store"
import { search } from "@/lib/search"

export default function PatternsPage() {
  const { patterns, searchQuery } = useStore()

  const results = searchQuery ? search(patterns, searchQuery) : patterns

  return (
    <main className="flex-1 overflow-y-auto p-6 grid xl:grid-cols-2 gap-4 content-start items-start">
        {results.map((p) => <PatternCard key={p.id} pattern={p} />)}
        {results.length === 0 && (
          <p className="text-[var(--text-muted)] text-sm mt-8 col-span-full">
            no patterns match "{searchQuery}"
          </p>
        )}
    </main>
  )
}

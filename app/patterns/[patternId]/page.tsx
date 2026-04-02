"use client"
import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

import TagBadge from "@/components/patterns/TagBadge"
import NoteEditor from "@/components/editor/NoteEditor"
import MarkdownPreview from "@/components/editor/MarkdownPreview"
import PatternContentTabs from "@/components/patterns/PatternContentTabs"
import PracticeTable from "@/components/patterns/PracticeTable"

export default function PatternDetailPage({ params }: { params: Promise<{ patternId: string }> }) {
  const { patternId } = use(params)
  const { patterns, notes, upsertNote, deletePattern, updatePatternContent, initCard } = useStore()
  const router = useRouter()

  const pattern = patterns.find(p => p.id === patternId)
  const existingNote = notes.find(n => n.patternId === patternId && !n.subquestionId)
  const [content, setContent] = useState(existingNote?.approach || "")
  const [editingNotes, setEditingNotes] = useState(false)

  if (!pattern) return (
    <main className="flex-1 flex items-center justify-center">
      <p className="text-[var(--text-muted)]">Pattern not found.</p>
    </main>
  )

  const buildPatternNote = () => {
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      alert("Add some personal insights first so there is something meaningful to review.")
      return null
    }

    return {
      id: existingNote?.id || crypto.randomUUID(),
      patternId: pattern.id,
      approach: trimmedContent,
      code: "",
      codeLanguage: "typescript",
      personalNotes: "",
      tags: [],
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  const handleSaveNote = () => {
    const note = buildPatternNote()
    if (!note) return

    upsertNote(note)
    alert("Saved personal insights.")
  }

  const handleQueueForReview = () => {
    const note = buildPatternNote()
    if (!note) return

    upsertNote(note)
    initCard(note.id, { cardType: "pattern-insight", promptMode: "recall" })
    alert("Pattern added to review.")
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this pattern completely?")) {
      deletePattern(pattern.id)
      router.push("/patterns")
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg)]">
        <header className="px-6 py-6 border-b border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--bg-subtle)] shrink-0 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">{pattern.name}</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] mt-1">{pattern.summary}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {pattern.tags.map(t => <TagBadge key={t} tag={t} />)}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleDelete} className="px-5 py-2.5 border border-red-500 text-red-500 rounded text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shadow-sm bg-[var(--bg)]">
              Delete Pattern
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-10 max-w-6xl mx-auto w-full pb-20">
          
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold border-b border-[var(--border)] pb-2 text-[var(--text)]">Core Foundations</h2>
            <PatternContentTabs 
              content={pattern.content} 
              onChange={(patch) => updatePatternContent(pattern.id, patch)} 
            />
          </section>

          <section className="space-y-4 mt-8">
            <PracticeTable pattern={pattern} />
          </section>

          <section className="space-y-4 mt-12">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2 px-1">
              <h2 className="text-xl font-extrabold text-[var(--text)]">Personal Insights / Reflections</h2>
              {editingNotes ? (
                <div className="flex gap-2">
                  <button onClick={() => setEditingNotes(false)} className="px-4 py-1.5 border border-[var(--border)] text-sm font-bold rounded hover:bg-[var(--bg-hover)] transition-colors shadow-sm">
                    Cancel
                  </button>
                  <button onClick={handleQueueForReview} className="px-4 py-1.5 border border-[var(--border)] text-sm font-bold rounded hover:bg-[var(--bg-hover)] transition-colors shadow-sm">
                    Add to Review
                  </button>
                  <button onClick={() => { handleSaveNote(); setEditingNotes(false); }} className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-bold rounded text-sm hover:opacity-90 transition-colors shadow-sm">
                    Save Insights
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleQueueForReview} className="px-4 py-1.5 border border-[var(--border)] text-[var(--text)] font-bold rounded text-sm hover:bg-[var(--bg-hover)] transition-colors shadow-sm">
                    Add to Review
                  </button>
                  <button onClick={() => setEditingNotes(true)} className="px-4 py-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text)] font-bold rounded text-sm hover:bg-[var(--bg-hover)] transition-colors shadow-sm">
                    Edit Insights
                  </button>
                </div>
              )}
            </div>
            {editingNotes ? (
              <div className="border border-[var(--border)] rounded overflow-hidden shadow-sm h-[400px]">
                <NoteEditor initialValue={content} onChange={setContent} />
              </div>
            ) : (
              <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded min-h-[100px] shadow-sm">
                <MarkdownPreview source={content} />
              </div>
            )}
          </section>

        </div>
      </main>
  )
}

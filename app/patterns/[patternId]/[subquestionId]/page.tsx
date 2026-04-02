"use client"
import { useState, useEffect, use } from "react"
import { useStore } from "@/lib/store"

import NoteEditor from "@/components/editor/NoteEditor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Editor from "@monaco-editor/react"

export default function SubquestionDetailPage({ params }: { params: Promise<{ patternId: string, subquestionId: string }> }) {
  const { patternId, subquestionId } = use(params)
  const { patterns, notes, upsertNote, updateSubquestion, initCard } = useStore()

  const pattern = patterns.find(p => p.id === patternId)
  const subquestion = pattern?.subquestions.find(sq => sq.id === subquestionId)
  
  const existingNote = notes.find(n => n.patternId === patternId && n.subquestionId === subquestionId)
  
  const [approach, setApproach] = useState(existingNote?.approach || "")
  const [code, setCode] = useState(existingNote?.code || "")
  const [codeLanguage, setCodeLanguage] = useState(existingNote?.codeLanguage || "python")
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  if (!pattern || !subquestion) return (
    <main className="flex-1 flex items-center justify-center">
      <p className="text-[var(--text-muted)] font-mono text-sm">Problem not found.</p>
    </main>
  )

  const buildProblemNote = () => {
    const trimmedApproach = approach.trim()
    const trimmedCode = code.trim()
    if (!trimmedApproach && !trimmedCode) {
      alert("Add your approach or code first so this review card has something useful to show.")
      return null
    }

    return {
      id: existingNote?.id || crypto.randomUUID(),
      patternId: pattern.id,
      subquestionId,
      approach: trimmedApproach,
      code: trimmedCode,
      codeLanguage,
      personalNotes: "",
      tags: [],
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  const handleSave = () => {
    const note = buildProblemNote()
    if (!note) return

    upsertNote(note)
    alert("Saved problem solution.")
  }

  const handleQueueForReview = () => {
    const note = buildProblemNote()
    if (!note) return

    upsertNote(note)
    initCard(note.id, { cardType: "problem-solution", promptMode: "recall" })
    alert("Question added to review.")
  }

  const toggleStatus = () => {
    updateSubquestion(pattern.id, subquestion.id, {
      status: subquestion.status === "solved" ? "unsolved" : "solved",
      solvedAt: subquestion.status === "unsolved" ? new Date().toISOString() : undefined
    })
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg)]">
        <header className="px-6 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--bg-subtle)] shrink-0 gap-4">
          <div className="flex flex-col">
            <Link href={`/patterns/${pattern.id}`} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 text-sm font-semibold mb-1">
              <ArrowLeft size={16} /> Back to {pattern.name}
            </Link>
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text)] truncate max-w-xl">{subquestion.title}</h1>
          </div>
          <div className="flex gap-2 shrink-0 items-center">
             <button onClick={toggleStatus} className={`px-5 py-2.5 border rounded text-xs font-bold transition-all shadow-sm ${subquestion.status === 'solved' ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-950/30' : 'border-[var(--border)] hover:bg-[var(--bg-hover)]'}`}>
              {subquestion.status === "solved" ? "✓ Solved" : "Mark as Solved"}
            </button>
            <button onClick={handleQueueForReview} className="px-5 py-2.5 border border-[var(--border)] rounded text-xs font-bold hover:bg-[var(--bg-hover)] shadow-sm transition-colors">
              Add to Review
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 bg-[var(--accent)] text-[var(--bg)] rounded text-xs font-bold hover:opacity-90 shadow-sm transition-opacity">
              Save Solution
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden p-4 flex flex-col lg:flex-row gap-4 h-full">
          {/* LEFT PANE: APPROACH */}
          <div className="flex-1 flex flex-col min-w-0 border border-[var(--border)] rounded bg-[var(--bg)] shadow-sm overflow-hidden h-full">
            <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] font-bold text-sm text-[var(--text-muted)] h-[37px] flex items-center">
              Approach & Logic
            </div>
            <div className="flex-1 overflow-auto relative bg-[var(--bg)]">
              <div className="absolute inset-0">
                <NoteEditor initialValue={approach} onChange={setApproach} />
              </div>
            </div>
          </div>

          {/* RIGHT PANE: CODE EDITOR */}
          <div className="flex-1 flex flex-col min-w-0 border border-[var(--border)] rounded bg-[var(--bg)] shadow-sm overflow-hidden h-full">
            <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] flex justify-between items-center h-[37px]">
              <span className="font-bold text-sm text-[var(--text-muted)]">Implementation</span>
              <select 
                value={codeLanguage} 
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-[var(--text)]"
              >
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
              </select>
            </div>
            <div className="flex-1 pt-4">
              <Editor
                height="100%"
                language={codeLanguage}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme={isDark ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "var(--font-mono)",
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  wordWrap: "on"
                }}
              />
            </div>
          </div>
        </div>
      </main>
  )
}

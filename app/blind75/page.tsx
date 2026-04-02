"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CheckCircle2, Circle, ExternalLink, FileText, Sparkles } from "lucide-react"

import { BLIND75_CATEGORIES, getBlind75Progress, getBlind75QuestionState } from "@/lib/blind75"
import { useStore } from "@/lib/store"

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-hover)]">
      <div
        className="h-full rounded-full bg-[var(--text)] transition-[width] duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function Blind75Page() {
  const {
    patterns,
    notes,
    blind75Entries,
    setBlind75QuestionCompleted,
    setBlind75QuestionNote,
  } = useStore()

  const [openNoteSlug, setOpenNoteSlug] = useState<string | null>(null)
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})

  const progress = useMemo(
    () => getBlind75Progress(patterns, notes, blind75Entries),
    [patterns, notes, blind75Entries]
  )

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 pb-16">
        <section className="overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-subtle)] shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5 p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                <Sparkles size={14} />
                Blind 75 Tracker
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
                  One place to keep the whole grind visible.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                  Track solved coverage, keep quick notes for each question, and jump into your
                  workspace whenever a Blind 75 problem already exists in your library.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Overall Progress
                  </p>
                  <p className="mt-2 text-3xl font-extrabold">{progress.percentage}%</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {progress.completed}/{progress.total} questions complete
                  </p>
                </div>
                <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Categories
                  </p>
                  <p className="mt-2 text-3xl font-extrabold">{progress.categories.length}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Array to Heap, all in one runbook
                  </p>
                </div>
                <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Workspace Links
                  </p>
                  <p className="mt-2 text-3xl font-extrabold">
                    {
                      BLIND75_CATEGORIES.flatMap((category) => category.questions).filter((question) =>
                        getBlind75QuestionState(question, patterns, notes, blind75Entries).linked
                      ).length
                    }
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Questions already connected to saved solutions
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--bg)] p-6 lg:border-t-0 lg:border-l">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Category Momentum
              </p>
              <div className="mt-5 space-y-4">
                {progress.categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="block rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4 transition-colors hover:bg-[var(--bg-hover)]"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="font-bold text-[var(--text)]">{category.title}</p>
                      <p className="text-sm font-semibold text-[var(--text-muted)]">
                        {category.completed}/{category.total}
                      </p>
                    </div>
                    <ProgressBar value={category.percentage} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {progress.categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="rounded border border-[var(--border)] bg-[var(--bg)] shadow-sm"
          >
            <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[var(--text)]">{category.title}</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {category.completed}/{category.total} complete
                  </p>
                </div>
                <div className="w-full max-w-xs">
                  <ProgressBar value={category.percentage} />
                </div>
              </div>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {category.questions.map((question, index) => {
                const state = getBlind75QuestionState(question, patterns, notes, blind75Entries)
                const currentNote = draftNotes[question.slug] ?? state.entry?.note ?? ""
                const isNoteOpen = openNoteSlug === question.slug

                return (
                  <div key={`${question.id}-${index}`} className="p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => setBlind75QuestionCompleted(question.slug, !state.completed)}
                          className="flex items-start gap-3 text-left"
                        >
                          <span className="pt-0.5">
                            {state.completed ? (
                              <CheckCircle2 size={20} className="text-green-500" />
                            ) : (
                              <Circle size={20} className="text-[var(--text-faint)]" />
                            )}
                          </span>
                          <span className="space-y-2">
                            <span className="block text-base font-bold text-[var(--text)]">
                              {question.title}
                            </span>
                            <span className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
                                {state.completed ? "Complete" : "In Progress"}
                              </span>
                              {state.isSolvedInWorkspace && (
                                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-green-600 dark:text-green-400">
                                  Solved In Workspace
                                </span>
                              )}
                              {state.hasWorkspaceNote && (
                                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
                                  Saved Solution
                                </span>
                              )}
                              {question.premium && (
                                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
                                  Premium
                                </span>
                              )}
                            </span>
                          </span>
                        </button>

                        {state.entry?.note && !isNoteOpen && (
                          <p className="mt-3 rounded border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-muted)]">
                            {state.entry.note}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        {state.linked ? (
                          <Link
                            href={`/patterns/${state.linked.patternId}/${state.linked.subquestion.id}`}
                            className="inline-flex items-center gap-2 rounded border border-[var(--text)] bg-[var(--text)] px-4 py-2 text-sm font-bold text-[var(--bg)] transition-opacity hover:opacity-90"
                          >
                            Open Workspace
                          </Link>
                        ) : (
                          <a
                            href={question.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded border border-[var(--border)] px-4 py-2 text-sm font-bold transition-colors hover:bg-[var(--bg-hover)]"
                          >
                            LeetCode
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setOpenNoteSlug(isNoteOpen ? null : question.slug)}
                          className="inline-flex items-center gap-2 rounded border border-[var(--border)] px-4 py-2 text-sm font-bold transition-colors hover:bg-[var(--bg-hover)]"
                        >
                          <FileText size={14} />
                          {isNoteOpen ? "Close Note" : "Quick Note"}
                        </button>
                      </div>
                    </div>

                    {isNoteOpen && (
                      <div className="mt-4 rounded border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                        <label
                          htmlFor={`blind75-note-${question.slug}`}
                          className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]"
                        >
                          What should future-you remember?
                        </label>
                        <textarea
                          id={`blind75-note-${question.slug}`}
                          value={currentNote}
                          onChange={(event) =>
                            setDraftNotes((prev) => ({ ...prev, [question.slug]: event.target.value }))
                          }
                          placeholder="Key invariant, edge case, bug you hit, or the one-liner that unlocks the question."
                          className="h-28 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm focus:outline-none focus:border-[var(--text)]"
                        />
                        <div className="mt-3 flex flex-wrap justify-between gap-3">
                          <p className="text-sm text-[var(--text-muted)]">
                            {state.linked
                              ? `Linked to ${state.linked.patternName} in your workspace.`
                              : "This one is not linked to a workspace note yet."}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setBlind75QuestionNote(question.slug, currentNote.trim())
                              setDraftNotes((prev) => ({ ...prev, [question.slug]: currentNote.trim() }))
                            }}
                            className="rounded border border-[var(--text)] bg-[var(--text)] px-4 py-2 text-sm font-bold text-[var(--bg)] transition-opacity hover:opacity-90"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

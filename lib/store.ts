import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"
import { get, set, del } from "idb-keyval"
import type {
  ActivityEvent,
  Pattern,
  Note,
  ReviewCard,
  PatternContent,
  Subquestion,
  ReviewCardType,
  ReviewPromptMode
} from "./types"
import { sm2 } from "./sm2"
import { createInitialBlind75Entries } from "./blind75"

// IndexedDB storage adapter
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

interface Store {
  searchQuery: string
  setSearchQuery: (q: string) => void

  patterns: Pattern[]
  notes: Note[]
  reviewCards: ReviewCard[]
  activityLog: ActivityEvent[]
  blind75Entries: Record<string, { completed: boolean; note: string; updatedAt: string }>

  addPattern: (p: Pattern) => void
  updatePattern: (id: string, patch: Partial<Pattern>) => void
  updatePatternContent: (id: string, contentPatch: Partial<PatternContent>) => void
  deletePattern: (id: string) => void

  addSubquestion: (patternId: string, sq: Subquestion) => void
  updateSubquestion: (patternId: string, sqId: string, patch: Partial<Subquestion>) => void
  deleteSubquestion: (patternId: string, sqId: string) => void
  bulkImportSubquestions: (patternId: string, sqs: Subquestion[]) => void

  upsertNote: (n: Note) => void
  deleteNote: (id: string) => void

  rateCard: (noteId: string, rating: 1 | 2 | 3 | 4) => void
  initCard: (
    noteId: string,
    options?: { cardType?: ReviewCardType; promptMode?: ReviewPromptMode }
  ) => void
  setBlind75QuestionCompleted: (slug: string, completed: boolean) => void
  setBlind75QuestionNote: (slug: string, note: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),

      patterns: [],
      notes: [],
      reviewCards: [],
      activityLog: [],
      blind75Entries: createInitialBlind75Entries(),

      addPattern: (p) =>
        set((s) => ({ patterns: [...s.patterns, p] })),

      updatePattern: (id, patch) =>
        set((s) => ({
          patterns: s.patterns.map((p) => p.id === id ? { ...p, ...patch } : p),
        })),

      updatePatternContent: (id, contentPatch) =>
        set((s) => ({
          patterns: s.patterns.map((p) => 
            p.id === id ? { ...p, content: { ...p.content, ...contentPatch } } : p
          ),
        })),

      deletePattern: (id) =>
        set((s) => {
          const notesToDelete = new Set(s.notes.filter(n => n.patternId === id).map(n => n.id));
          return {
            patterns: s.patterns.filter((p) => p.id !== id),
            notes: s.notes.filter((n) => !notesToDelete.has(n.id)),
            reviewCards: s.reviewCards.filter(rc => !notesToDelete.has(rc.noteId)),
            activityLog: s.activityLog.filter((event) => event.patternId !== id),
          };
        }),

      addSubquestion: (patternId, sq) =>
        set((s) => ({
          patterns: s.patterns.map((p) =>
            p.id === patternId ? { ...p, subquestions: [...p.subquestions, sq] } : p
          ),
        })),

      updateSubquestion: (patternId, sqId, patch) =>
        set((s) => {
          const pattern = s.patterns.find((p) => p.id === patternId)
          const currentSubquestion = pattern?.subquestions.find((sq) => sq.id === sqId)
          const nextStatus = patch.status ?? currentSubquestion?.status
          const shouldLogSolve =
            currentSubquestion?.status === "unsolved" && nextStatus === "solved"

          return {
            patterns: s.patterns.map((p) =>
              p.id === patternId
                ? { ...p, subquestions: p.subquestions.map(sq => sq.id === sqId ? { ...sq, ...patch } : sq) }
                : p
            ),
            activityLog: shouldLogSolve
              ? [
                  ...s.activityLog,
                  {
                    id: crypto.randomUUID(),
                    type: "subquestion-solved",
                    timestamp: patch.solvedAt || new Date().toISOString(),
                    patternId,
                    subquestionId: sqId,
                  },
                ]
              : s.activityLog,
          }
        }),

      deleteSubquestion: (patternId, sqId) =>
        set((s) => {
          const notesToDelete = new Set(s.notes.filter(n => n.patternId === patternId && n.subquestionId === sqId).map(n => n.id));
          return {
            patterns: s.patterns.map((p) =>
              p.id === patternId 
                ? { ...p, subquestions: p.subquestions.filter(sq => sq.id !== sqId) } 
                : p
            ),
            notes: s.notes.filter(n => !notesToDelete.has(n.id)),
            reviewCards: s.reviewCards.filter(rc => !notesToDelete.has(rc.noteId)),
            activityLog: s.activityLog.filter((event) => event.subquestionId !== sqId),
          };
        }),

      bulkImportSubquestions: (patternId, sqs) =>
        set((s) => ({
          patterns: s.patterns.map((p) =>
            p.id === patternId 
              ? { ...p, subquestions: [...p.subquestions, ...sqs] } 
              : p
          ),
        })),

      upsertNote: (n) =>
        set((s) => {
          const exists = s.notes.find((x) => x.id === n.id)
          return {
            notes: exists
              ? s.notes.map((x) => x.id === n.id ? n : x)
              : [...s.notes, n],
          }
        }),

      deleteNote: (id) =>
        set((s) => ({
          notes: s.notes.filter((n) => n.id !== id),
          reviewCards: s.reviewCards.filter((rc) => rc.noteId !== id),
          activityLog: s.activityLog.filter((event) => event.noteId !== id)
        })),

      initCard: (noteId, options) =>
        set((s) => {
          const existingCard = s.reviewCards.find((c) => c.noteId === noteId)
          if (existingCard) {
            return {
              reviewCards: s.reviewCards.map((c) =>
                c.noteId === noteId
                  ? {
                      ...c,
                      cardType: options?.cardType ?? c.cardType,
                      promptMode: options?.promptMode ?? c.promptMode ?? "recall",
                    }
                  : c
              ),
            }
          }

          return {
            reviewCards: [
              ...s.reviewCards,
              {
                noteId,
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextDue: new Date().toISOString(),
                cardType: options?.cardType,
                promptMode: options?.promptMode ?? "recall",
              },
            ],
          }
        }),

      rateCard: (noteId, rating) =>
        set((s) => {
          const note = s.notes.find((entry) => entry.id === noteId)

          return {
            reviewCards: s.reviewCards.map((c) =>
              c.noteId === noteId ? { ...c, ...sm2(c, rating), lastRating: rating } : c
            ),
            activityLog: note
              ? [
                  ...s.activityLog,
                  {
                    id: crypto.randomUUID(),
                    type: "review-rated",
                    timestamp: new Date().toISOString(),
                    patternId: note.patternId,
                    subquestionId: note.subquestionId,
                    noteId,
                    rating,
                  },
                ]
              : s.activityLog,
          }
        }),

      setBlind75QuestionCompleted: (slug, completed) =>
        set((s) => ({
          blind75Entries: {
            ...s.blind75Entries,
            [slug]: {
              completed,
              note: s.blind75Entries[slug]?.note || "",
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      setBlind75QuestionNote: (slug, note) =>
        set((s) => ({
          blind75Entries: {
            ...s.blind75Entries,
            [slug]: {
              completed: s.blind75Entries[slug]?.completed || false,
              note,
              updatedAt: new Date().toISOString(),
            },
          },
        })),
    }),
    { 
      name: "dsa-notes-store",
      storage: createJSONStorage(() => idbStorage),
      version: 2,
      migrate: (persistedState: unknown, version) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState as Store
        }

        const state = persistedState as Store

        if (version < 2) {
          return {
            ...state,
            blind75Entries: {},
          }
        }

        return state
      },
    }
  )
)

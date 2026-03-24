import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"
import { get, set, del } from "idb-keyval"
import type { Pattern, Note, ReviewCard, PatternContent, Subquestion } from "./types"
import { sm2 } from "./sm2"

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
  initCard: (noteId: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),

      patterns: [],
      notes: [],
      reviewCards: [],

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
          };
        }),

      addSubquestion: (patternId, sq) =>
        set((s) => ({
          patterns: s.patterns.map((p) =>
            p.id === patternId ? { ...p, subquestions: [...p.subquestions, sq] } : p
          ),
        })),

      updateSubquestion: (patternId, sqId, patch) =>
        set((s) => ({
          patterns: s.patterns.map((p) =>
            p.id === patternId 
              ? { ...p, subquestions: p.subquestions.map(sq => sq.id === sqId ? { ...sq, ...patch } : sq) } 
              : p
          ),
        })),

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
            reviewCards: s.reviewCards.filter(rc => !notesToDelete.has(rc.noteId))
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
          reviewCards: s.reviewCards.filter((rc) => rc.noteId !== id)
        })),

      initCard: (noteId) =>
        set((s) => {
          if (s.reviewCards.find((c) => c.noteId === noteId)) return s
          return {
            reviewCards: [
              ...s.reviewCards,
              {
                noteId,
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextDue: new Date().toISOString(),
              },
            ],
          }
        }),

      rateCard: (noteId, rating) =>
        set((s) => ({
          reviewCards: s.reviewCards.map((c) =>
            c.noteId === noteId ? { ...c, ...sm2(c, rating), lastRating: rating } : c
          ),
        })),
    }),
    { 
      name: "dsa-notes-store",
      storage: createJSONStorage(() => idbStorage) 
    }
  )
)

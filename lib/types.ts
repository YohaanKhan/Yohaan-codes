export type Difficulty = "easy" | "medium" | "hard"

export interface PatternContent {
  description: string;
  whenToUse: string;
  approach: string;
  complexity: string;
  codeTemplate: string;
  variations: string;
}

export interface Subquestion {
  id: string
  title: string
  difficulty: Difficulty
  link?: string
  status: "unsolved" | "solved"
  solvedAt?: string
}

export interface Pattern {
  id: string
  name: string
  tags: string[]
  summary: string
  content: PatternContent;
  subquestions: Subquestion[]
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  patternId: string
  subquestionId?: string  // null = pattern-level note
  approach: string        // markdown
  code: string            // raw code string
  codeLanguage: string    // "python" | "typescript" etc
  personalNotes: string   // markdown
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ReviewCard {
  noteId: string
  easeFactor: number      // SM-2 default 2.5
  interval: number        // days
  repetitions: number
  nextDue: string         // ISO date
  lastRating?: 1 | 2 | 3 | 4
}

# DSA Domain Context
**Activation:** model-decision

## Data model mental model
A Pattern (e.g. "Sliding Window") is the top-level entity.
Each Pattern has multiple Subquestions — these are specific LC problems.
Each Subquestion has one Note containing: approach (markdown), 
code (string), codeLanguage, personalNotes (markdown).
ReviewCards are derived from Notes — one card per note, keyed by noteId.

## SM-2 spaced repetition
Ratings are 1–4 (not 0–5). 1 = blackout, 2 = hard, 3 = good, 4 = easy.
The easeFactor floor is 1.3. nextDue is always stored as ISO string.
Never mutate card state directly — always go through store.rateCard().

## Patterns we support (seed data reference)
Sliding Window, Two Pointers, Fast & Slow Pointers, Merge Intervals,
Cyclic Sort, In-place Reversal, Tree BFS, Tree DFS, Two Heaps,
Subsets, Modified Binary Search, Top K Elements, K-way Merge, DP

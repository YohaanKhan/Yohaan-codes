---
description: conduct a spaced repetition review session
---
# Review Session Workflow

1. Call getDueCards() from lib/sm2.ts against the current store state.
2. If zero cards are due, display the next due date and stop.
3. Render the review session at /review — flip card shows: 
   front = subquestion title + pattern name, back = approach + code block.
4. After rating (1–4), call store.rateCard(noteId, rating).
5. Persist updated ReviewCard to localStorage via Zustand persist.
6. Show session summary: cards reviewed, next due breakdown.

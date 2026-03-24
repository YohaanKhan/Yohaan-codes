---
description: export user data
---
# Export Workflow

1. Read all patterns, notes, and reviewCards from the Zustand store.
2. Serialize to a single JSON blob: { patterns, notes, reviewCards, exportedAt }.
3. Write to /public/exports/dsa-backup-<timestamp>.json.
4. Also generate a /public/exports/dsa-notes-<timestamp>.md — one section 
   per pattern, subsections per subquestion, code in fenced blocks.
5. Show download links for both files as artifacts.

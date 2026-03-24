---
description: add a new subquestion to an existing pattern
---
# Add Subquestion Workflow

1. Ask for: parent pattern name, subquestion title (e.g. "LC 3 - Longest substring"), 
   difficulty (easy/medium/hard), and optional LeetCode URL.
2. Generate IDs for the subquestion and its linked note.
3. Push the subquestion into the correct pattern's subquestions[] array in patterns.json.
4. Create an empty INote entry with the subquestionId linked.
5. Call store.initCard(noteId) to queue it for spaced repetition.
6. Confirm the subquestion appears in SubquestionList.tsx for that pattern.

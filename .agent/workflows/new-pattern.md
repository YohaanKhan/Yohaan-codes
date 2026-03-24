---
description: create a new DSA pattern
---
# New Pattern Workflow

1. Ask the user for: pattern name, 1-sentence summary, and comma-separated tags.
2. Generate a UUID for the pattern id (use crypto.randomUUID() format).
3. Create the IPattern object in /data/patterns.json — append to the array.
4. Create a starter INote in the Zustand store shape with empty approach, 
   code, and personalNotes fields.
5. Verify the pattern renders in the sidebar by checking PatternCard.tsx 
   accepts the new shape.
6. Open the browser subagent to confirm the pattern appears in the UI 
   at /patterns — take a screenshot as artifact.

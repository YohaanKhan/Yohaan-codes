# Code Style
**Activation:** glob — **/*.{ts,tsx}

- Arrow functions for all components and callbacks
- Prefer const over let, never var
- Explicit return types on all exported functions
- No console.log — use a DEBUG flag or remove entirely
- Two-space indent
- Interfaces prefixed with I — IPattern, INote, IReviewCard
- Keep components under 150 lines — split if larger
- Always handle loading and error states in data-fetching components

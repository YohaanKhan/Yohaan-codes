# DSA Notes — Stack Rules
**Activation:** always-on

## Tech
- Next.js 15 App Router, TypeScript strict mode
- Tailwind CSS only — no separate .css files
- Zustand with persist middleware for all state
- Shiki for syntax highlighting (NOT highlight.js, NOT prism)
- Fuse.js for search
- SM-2 algorithm lives in lib/sm2.ts as a pure function — do not move it

## File conventions
- Components go in components/<domain>/<ComponentName>.tsx
- All shared types in lib/types.ts — never inline type defs in components
- Zustand store in lib/store.ts — one store, multiple slices
- Data files are .json in /data — never hardcode seed data in components

## Do not
- Do not install axios — use fetch
- Do not use React class components
- Do not use pages/ router — app router only
- Do not create .css files

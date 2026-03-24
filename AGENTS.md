<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — DSA Notes

## Stack
- Next.js 15 App Router · TypeScript strict · Tailwind · Zustand · Shiki · SM-2

## Non-negotiables
- Never touch lib/sm2.ts logic without explicit user confirmation
- Never install new dependencies without asking — the package list is deliberate
- Store state lives in localStorage — no backend, no db, no auth

## Model hints (Gemini Pro)
- When generating SM-2 related code, reference lib/sm2.ts — do not reimplement
- Pattern IDs are kebab-case slugs (e.g. "sliding-window"), not UUIDs
- Code stored in notes is raw string — Shiki handles highlighting at render time

## PR conventions
- Conventional commits: feat:, fix:, refactor:, chore:
- Never commit /public/exports/ — it's in .gitignore

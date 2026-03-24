"use client"
import type { Subquestion } from "@/lib/types"

const diffColors = {
  easy: "text-green-600 dark:text-green-400",
  medium: "text-yellow-600 dark:text-yellow-500",
  hard: "text-red-500",
}

export default function SubquestionList({ subquestions }: { subquestions: Subquestion[] }) {
  if (!subquestions?.length) return null

  return (
    <div className="mt-2 space-y-2">
      <h4 className="text-sm font-semibold text-[var(--text-muted)]">Subquestions</h4>
      <ul className="space-y-1">
        {subquestions.map((sq) => (
          <li key={sq.id} className="text-sm flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded border border-[var(--border)] bg-[var(--bg)] gap-2">
            <span className="truncate">{sq.title}</span>
            <div className="flex items-center gap-3 shrink-0">
              {sq.link && (
                <a href={sq.link} target="_blank" rel="noreferrer" className="text-xs hover:underline decoration-[var(--border)] text-[var(--text-muted)]">
                  Link ↗
                </a>
              )}
              <span className={`text-xs font-bold uppercase ${diffColors[sq.difficulty]}`}>
                {sq.difficulty}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

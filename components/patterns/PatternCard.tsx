import Link from "next/link"
import type { Pattern } from "@/lib/types"
import TagBadge from "./TagBadge"
import SubquestionList from "./SubquestionList"

export default function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <div className="border border-[var(--border)] rounded overflow-hidden bg-[var(--bg)] shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold">
            <Link href={`/patterns/${pattern.id}`} className="hover:underline decoration-[var(--border)] underline-offset-4">
              {pattern.name}
            </Link>
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">{pattern.summary}</p>
        </div>
        <div className="flex gap-1 flex-wrap shrink-0">
          {pattern.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
      {(pattern.subquestions?.length > 0) && (
        <div className="p-4 bg-[var(--bg)]">
          <SubquestionList subquestions={pattern.subquestions} />
        </div>
      )}
    </div>
  )
}

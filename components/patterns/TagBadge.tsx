export default function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="px-2 py-0.5 text-xs rounded bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)]">
      {tag}
    </span>
  )
}

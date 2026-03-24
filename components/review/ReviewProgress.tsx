"use client"

export default function ReviewProgress({ current, total }: { current: number; total: number }) {
  const percentage = total === 0 ? 100 : Math.round((current / total) * 100)
  
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2">
      <div className="flex justify-between text-sm font-semibold text-[var(--text-muted)]">
        <span>Review Session</span>
        <span>{current} / {total}</span>
      </div>
      <div className="w-full h-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--accent)] transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

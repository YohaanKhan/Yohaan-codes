"use client"

export default function RatingBar({ onRate }: { onRate: (rating: 1 | 2 | 3 | 4) => void }) {
  const options = [
    { rating: 1 as const, label: "1 - Blackout", hint: "Could not recall it", className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400" },
    { rating: 2 as const, label: "2 - Hard", hint: "Needed heavy effort", className: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/30 dark:text-orange-400" },
    { rating: 3 as const, label: "3 - Good", hint: "Mostly solid recall", className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-400" },
    { rating: 4 as const, label: "4 - Easy", hint: "Felt automatic", className: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <p className="text-sm font-semibold text-[var(--text-muted)]">
        Rate how well you recalled this before seeing the answer.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {options.map((option) => (
          <button
            key={option.rating}
            onClick={() => onRate(option.rating)}
            className={`rounded border px-4 py-4 text-left transition-colors font-bold text-sm ${option.className}`}
          >
            <span className="block">{option.label}</span>
            <span className="mt-1 block text-xs font-semibold opacity-80">{option.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

export default function RatingBar({ onRate }: { onRate: (rating: 1 | 2 | 3 | 4) => void }) {
  return (
    <div className="flex gap-2 justify-center w-full max-w-2xl mx-auto">
      <button onClick={() => onRate(1)} className="flex-1 max-w-[120px] py-3 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400 transition-colors font-bold text-sm">
        1 - Blackout
      </button>
      <button onClick={() => onRate(2)} className="flex-1 max-w-[120px] py-3 rounded border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/30 dark:text-orange-400 transition-colors font-bold text-sm">
        2 - Hard
      </button>
      <button onClick={() => onRate(3)} className="flex-1 max-w-[120px] py-3 rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-400 transition-colors font-bold text-sm">
        3 - Good
      </button>
      <button onClick={() => onRate(4)} className="flex-1 max-w-[120px] py-3 rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400 transition-colors font-bold text-sm">
        4 - Easy
      </button>
    </div>
  )
}

"use client"
import MarkdownPreview from "../editor/MarkdownPreview"

export default function FlipCard({
  question,
  answer,
  isFlipped,
  onFlip
}: {
  question: { title: string; difficulty: string; tags: string[]; summary: string };
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] rounded bg-[var(--bg)] shadow-sm min-h-[300px] flex flex-col">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col items-center justify-center min-h-[150px] text-center gap-2">
          <h2 className="text-xl font-bold">{question.title}</h2>
          <p className="text-sm text-[var(--text-muted)]">{question.summary}</p>
          <div className="flex gap-2 text-xs font-bold uppercase mt-2">
            <span className="text-[var(--accent)]">{question.difficulty}</span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {!isFlipped ? (
            <div className="flex-1 flex items-center justify-center min-h-[150px]">
              <button 
                onClick={onFlip}
                className="px-6 py-2 bg-[var(--accent)] text-[var(--bg)] rounded font-bold hover:opacity-90 transition-opacity"
              >
                Show Answer
              </button>
            </div>
          ) : (
            <div className="flex-1 animate-in fade-in duration-500">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-4 border-b border-[var(--border)] pb-2">Approach & Code</h3>
              <MarkdownPreview source={answer} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

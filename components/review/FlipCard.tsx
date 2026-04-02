"use client"
import CodeBlock from "../editor/CodeBlock"
import MarkdownPreview from "../editor/MarkdownPreview"

export default function FlipCard({
  card,
  answer,
  isFlipped,
  onFlip
}: {
  card: {
    patternName: string
    summary: string
    tags: string[]
    cardType: "pattern-insight" | "problem-solution"
    promptTitle: string
    promptBody: string
    subquestionTitle?: string
    difficulty?: string
    code?: string
    codeLanguage?: string
  };
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const cardTypeLabel = card.cardType === "problem-solution" ? "Problem Solution" : "Pattern Insight"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="border border-[var(--border)] rounded bg-[var(--bg)] shadow-sm min-h-[420px] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-1 bg-[var(--bg)] text-[var(--accent)]">
              {cardTypeLabel}
            </span>
            {card.difficulty && (
              <span className="rounded-full border border-[var(--border)] px-3 py-1 bg-[var(--bg)]">
                {card.difficulty}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{card.patternName}</h2>
            {card.subquestionTitle && (
              <p className="text-base font-semibold text-[var(--accent)]">{card.subquestionTitle}</p>
            )}
            <p className="text-sm text-[var(--text-muted)]">{card.summary}</p>
          </div>
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {!isFlipped ? (
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Recall Prompt
                </p>
                <h3 className="text-2xl font-bold text-[var(--text)]">{card.promptTitle}</h3>
                <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">{card.promptBody}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onFlip}
                  className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded font-bold hover:opacity-90 transition-opacity"
                >
                  Reveal Saved Answer
                </button>
                <p className="text-sm text-[var(--text-muted)]">
                  Recall first, then compare against your saved notes.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 animate-in fade-in duration-500">
              <div className="mb-5 border-b border-[var(--border)] pb-3">
                <h3 className="text-sm font-semibold text-[var(--text-muted)]">Saved Answer</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                    Approach
                  </h4>
                  <MarkdownPreview source={answer} />
                </div>
                {card.cardType === "problem-solution" && card.code && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                      Saved Code
                    </h4>
                    <CodeBlock className={`language-${card.codeLanguage || "text"}`}>
                      {card.code}
                    </CodeBlock>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from "react"
import { useStore } from "@/lib/store"
import type { Pattern, Subquestion } from "@/lib/types"
import { CheckCircle2, Circle, Plus, Upload, Trash } from "lucide-react"
import Link from "next/link"

export default function PracticeTable({ pattern }: { pattern: Pattern }) {
  const { addSubquestion, updateSubquestion, bulkImportSubquestions, deleteSubquestion } = useStore()
  const [query, setQuery] = useState("")
  const [showBulk, setShowBulk] = useState(false)
  const [bulkText, setBulkText] = useState("")

  const stats = {
    total: pattern.subquestions.length,
    solved: pattern.subquestions.filter(sq => sq.status === "solved").length
  }
  const percentage = stats.total === 0 ? 0 : Math.round((stats.solved / stats.total) * 100)

  const filtered = pattern.subquestions.filter(sq => 
    sq.title.toLowerCase().includes(query.toLowerCase())
  )

  const handleToggle = (sq: Subquestion) => {
    updateSubquestion(pattern.id, sq.id, {
      status: sq.status === "solved" ? "unsolved" : "solved",
      solvedAt: sq.status === "unsolved" ? new Date().toISOString() : undefined
    })
  }

  const handleAddSingle = () => {
    const title = prompt("Enter question title (e.g., LC 3 - Longest Substring):")
    if (!title) return
    const id = crypto.randomUUID()
    addSubquestion(pattern.id, {
      id,
      title,
      difficulty: "medium",
      status: "unsolved"
    })
  }

  const handleBulkSubmit = () => {
    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean)
    const newSqs: Subquestion[] = lines.map(line => {
      // Very naive parsing: assumes each line is a title
      return {
        id: crypto.randomUUID(),
        title: line,
        difficulty: "medium",
        status: "unsolved"
      }
    })
    bulkImportSubquestions(pattern.id, newSqs)
    setBulkText("")
    setShowBulk(false)
  }

  return (
    <div className="border border-[var(--border)] rounded bg-[var(--bg)] shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-[var(--text)]">Questions Queue</h3>
          <p className="text-sm text-[var(--accent)] font-semibold mt-1">
            {stats.solved} / {stats.total} solved ({percentage}%)
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)] flex-1 sm:w-48 shadow-sm"
          />
          <button onClick={() => setShowBulk(!showBulk)} className="px-3 py-1.5 border border-[var(--border)] rounded text-sm hover:bg-[var(--bg-hover)] flex items-center gap-1 font-semibold text-[var(--text-muted)] shadow-sm">
            <Upload size={14} /> Bulk
          </button>
          <button onClick={handleAddSingle} className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] rounded text-sm font-bold hover:opacity-90 flex items-center gap-1 shrink-0 shadow-sm">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {showBulk && (
        <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-hover)]">
          <p className="text-xs font-semibold mb-2 text-[var(--text-muted)]">Paste multiline list of questions (one per line):</p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"LC 1 - Two Sum\nLC 15 - 3Sum"}
            className="w-full h-32 px-3 py-3 bg-[var(--bg)] border border-[var(--border)] rounded text-sm font-mono focus:outline-none shadow-sm"
          />
          <div className="flex justify-end mt-3 gap-2">
            <button onClick={() => setShowBulk(false)} className="text-xs font-bold px-4 py-2 hover:bg-[var(--border)] rounded">Cancel</button>
            <button onClick={handleBulkSubmit} className="text-xs font-bold px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded shadow-sm">Import List</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-sm font-mono text-[var(--text-muted)] bg-[var(--bg)]">
          No practice questions found. Add some to build tracking momentum.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[var(--text-muted)] bg-[var(--bg-subtle)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-semibold w-12 text-center">Status</th>
                <th className="px-4 py-3 font-semibold">Question Title</th>
                <th className="px-4 py-3 font-semibold w-28">Difficulty</th>
                <th className="px-4 py-3 font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-mono">
              {filtered.map(sq => (
                <tr key={sq.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                  <td className="px-4 py-4 text-center cursor-pointer" onClick={() => handleToggle(sq)}>
                    {sq.status === "solved" ? (
                      <CheckCircle2 size={18} className="text-green-500 mx-auto drop-shadow-sm" />
                    ) : (
                      <Circle size={18} className="text-[var(--border)] mx-auto group-hover:text-[var(--text-faint)]" />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/patterns/${pattern.id}/${sq.id}`} className="font-semibold text-[var(--text)] hover:text-[var(--accent)] hover:underline decoration-2 underline-offset-4 decoration-[var(--border)]">
                      {sq.title}
                    </Link>
                    {sq.status === "solved" && sq.solvedAt && <p className="text-[11px] text-[var(--text-muted)] mt-1 font-sans font-medium">Solved {new Date(sq.solvedAt).toLocaleDateString()}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={sq.difficulty}
                      onChange={(e) => updateSubquestion(pattern.id, sq.id, { difficulty: e.target.value as any })}
                      className={`bg-transparent border-none text-xs font-bold uppercase cursor-pointer focus:outline-none ${sq.difficulty === 'easy' ? 'text-green-600 dark:text-green-400' : sq.difficulty === 'medium' ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-500'}`}
                    >
                      <option value="easy" className="text-[var(--text)]">Easy</option>
                      <option value="medium" className="text-[var(--text)]">Medium</option>
                      <option value="hard" className="text-[var(--text)]">Hard</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 flex items-center gap-2">
                    <Link 
                      href={`/patterns/${pattern.id}/${sq.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold bg-[var(--bg-subtle)] border border-[var(--border)] px-4 py-2 rounded text-[var(--text)] hover:text-[var(--bg)] hover:bg-[var(--text)] hover:border-[var(--text)] transition-all shadow-sm"
                    >
                      Solve <span className="text-sm leading-none">→</span>
                    </Link>
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete '${sq.title}'?`)) {
                          deleteSubquestion(pattern.id, sq.id);
                        }
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                      title="Delete Subquestion"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
